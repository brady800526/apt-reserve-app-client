interface ConfirmationEmailProps {
  firstName: string;
  lastName: string;
  listingTitle: string;
  listingDescription?: string;
  listingPrice?: number;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  hostName?: string;
  listingUrl?: string;
}

export const getConfirmationEmailHtml = ({
  firstName,
  lastName,
  listingTitle,
  listingDescription,
  listingPrice,
  startDate,
  endDate,
  numberOfPeople,
  hostName,
  listingUrl,
}: ConfirmationEmailProps) => {
  const start = new Date(startDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const end = new Date(endDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const nights = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const totalPrice = listingPrice ? listingPrice * nights : 0;

  // Placeholder image for the carousel feel
  const heroImage =
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reservation Confirmed</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #484848; margin: 0; padding: 0; background-color: #f7f7f7; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e4; }
        .header { padding: 20px; text-align: center; border-bottom: 1px solid #e4e4e4; }
        .header h1 { color: #FF5A5F; margin: 0; font-size: 24px; }
        .hero { width: 100%; height: 300px; background-image: url('${heroImage}'); background-size: cover; background-position: center; }
        .content { padding: 30px; }
        .h2 { font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #484848; }
        .section { margin-bottom: 30px; border-bottom: 1px solid #e4e4e4; padding-bottom: 20px; }
        .section:last-child { border-bottom: none; }
        .details-grid { display: table; width: 100%; margin-top: 10px; }
        .details-row { display: table-row; }
        .details-cell { display: table-cell; padding: 8px 0; width: 50%; vertical-align: top; }
        .label { font-size: 14px; color: #767676; }
        .value { font-size: 16px; font-weight: 500; color: #484848; }
        .button-container { text-align: center; margin-top: 30px; }
        .button { background-color: #FF5A5F; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block; }
        .footer { background-color: #f7f7f7; padding: 20px; text-align: center; font-size: 12px; color: #767676; border-top: 1px solid #e4e4e4; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reservation Confirmed</h1>
        </div>
        
        <div class="hero"></div>
        
        <div class="content">
          <div class="section">
            <div class="h2">You're going to ${listingTitle}!</div>
            <p>Hi ${firstName}, your reservation is confirmed. ${hostName ? `Your host ${hostName} is looking forward to welcoming you.` : ""}</p>
          </div>

          <div class="section">
            <div class="h2">Trip Details</div>
            <div class="details-grid">
              <div class="details-row">
                <div class="details-cell">
                  <div class="label">Check-in</div>
                  <div class="value">${start}</div>
                  <div class="label" style="font-size: 12px;">After 3:00 PM</div>
                </div>
                <div class="details-cell">
                  <div class="label">Checkout</div>
                  <div class="value">${end}</div>
                  <div class="label" style="font-size: 12px;">Before 11:00 AM</div>
                </div>
              </div>
            </div>
            <div class="details-grid" style="margin-top: 15px;">
              <div class="details-row">
                <div class="details-cell">
                  <div class="label">Guests</div>
                  <div class="value">${numberOfPeople} guest${numberOfPeople > 1 ? "s" : ""}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="h2">Payment</div>
             <div class="details-grid">
              <div class="details-row">
                <div class="details-cell">
                  <div class="value">${listingTitle}</div>
                  <div class="label">${listingDescription ? listingDescription.substring(0, 50) + "..." : "Entire home/apt"}</div>
                </div>
              </div>
              <div class="details-row">
                <div class="details-cell" style="padding-top: 15px;">
                  <div class="label">Total Cost</div>
                  <div class="value" style="font-size: 18px;">$${totalPrice}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="button-container">
            <a href="${listingUrl || '#'}" class="button">View Reservation</a>
          </div>
        </div>

        <div class="footer">
          <p>Sent from Apt Reserve App</p>
          <p>Reference: ${firstName} ${lastName} - ${start}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
