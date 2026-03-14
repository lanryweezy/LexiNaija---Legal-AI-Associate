// Supabase Edge Function: payment-reminders
// Deploy via: supabase functions deploy payment-reminders

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  try {
    // 1. Fetch upcoming payments due in 5 days, 3 days, or today
    const now = new Date();
    const fiveDaysOut = new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000));
    const threeDaysOut = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));

    const { data: subs, error } = await supabase
      .from('subscriptions')
      .select('*, profiles(full_name, solicitor_name)')
      .filter('status', 'eq', 'Active')
      .or(`next_payment_date.lte.${fiveDaysOut.toISOString()},next_payment_date.lte.${threeDaysOut.toISOString()}`)

    if (error) throw error;

    const results = [];

    for (const sub of subs) {
      const dueDate = new Date(sub.next_payment_date);
      const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      let type = '';
      if (diffDays === 5) type = 'PAYMENT_REMINDER_5D';
      else if (diffDays === 3) type = 'PAYMENT_REMINDER_3D';
      else if (diffDays === 0) type = 'PAYMENT_REMINDER_0H';

      if (!type) continue;

      // Check if already sent
      const { data: log } = await supabase
        .from('notification_logs')
        .select('*')
        .match({ user_id: sub.user_id, notification_type: type })
        .single();

      if (log) continue; // Already sent for this period

      // 2. Send via Resend
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'LexiNaija Pro <billing@lexinaija.pro>',
          to: [sub.profiles.email], 
          subject: `LexiNaija Pro Subscription Renewal: ${diffDays === 0 ? 'Today' : `in ${diffDays} Days`}`,
          html: `
            <div style="font-family: serif; color: #0f172a; padding: 20px;">
              <h2 style="font-style: italic; border-bottom: 2px solid #94a3b8;">Subscription Protocol Notification</h2>
              <p>Dear ${sub.profiles.solicitor_name || 'Counsel'},</p>
              <p>This is a formal notification that your <strong>${sub.plan_name}</strong> subscription is due for renewal on <strong>${dueDate.toLocaleDateString()}</strong>.</p>
              <p>Status: ${diffDays === 0 ? 'DUE TODAY' : `Renewing in ${diffDays} days`}</p>
              <br/>
              <a href="https://lexinaija.pro/billing" style="background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 1.5px;">Manage Workspace Subscription</a>
              <p style="font-size: 10px; color: #64748b; margin-top: 40px;">Institutional Legal Intelligence | LexiNaija Pro</p>
            </div>
          `
        })
      });

      if (res.ok) {
        await supabase.from('notification_logs').insert({
          user_id: sub.user_id,
          notification_type: type,
          recipient_email: sub.profiles.email
        });
        results.push({ user: sub.user_id, status: 'Success' });
      }
    }

    return new Response(JSON.stringify({ processed: results.length, data: results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
})
