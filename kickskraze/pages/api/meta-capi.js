import crypto from "crypto";

const sha256 = (value) =>
    crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const {
            event_name,
            event_id,
            event_source_url,

            // custom data
            value,
            currency,
            contents,
            content_ids,
            num_items,
            content_type,

            // user data
            email,
            phone,
            fbp,
            fbc,
        } = req.body;

        const clientIp =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress;

        const payload = {
            data: [
                {
                    event_name,
                    event_time: Math.floor(Date.now() / 1000),
                    event_id,
                    action_source: "website",
                    event_source_url,

                    user_data: {
                        em: email ? [sha256(email)] : undefined,
                        ph: phone ? [sha256(phone)] : undefined,
                        fbp: fbp || undefined,
                        fbc: fbc || undefined,
                        client_user_agent: req.headers["user-agent"],
                        client_ip_address: clientIp,
                    },

                    custom_data: {
                        ...(value != null && { value: Number(value) }),
                        ...(currency && { currency }),
                        ...(contents && { contents }),
                        ...(content_ids && { content_ids }),
                        ...(num_items != null && { num_items }),
                        ...(content_type && { content_type }),
                    },
                },
            ],
        };

        const response = await fetch(
            `https://graph.facebook.com/v17.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );

        const result = await response.json();
        return res.status(200).json(result);

    } catch (err) {
        console.error("Meta CAPI error:", err);
        return res.status(500).json({ error: "Meta CAPI failed" });
    }
}
