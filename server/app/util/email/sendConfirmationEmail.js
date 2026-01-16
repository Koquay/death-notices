const sendOrderConfirmationEmail = (order) => {
    console.log('***** sendBuyerEmail called', order)  
    if(!order?.deliveryAddress.email) return;

  const mailOptions = {
        from: `REMU <kkwilson852@gmail.com>`,
        to: `${order.deliveryAddress.email}`,
        subject: `Your Order No. #${order._id}`, 

        html: `
        <p>Dear ${order.deliveryAddress.firstName},<br>
        We are pleased to inform you that your order for ${order.deliveryAddress.firstName}
        ${order.deliveryAddress.lastName}
        was successfully placed.<br>We look forward to serving you again soon.<br> Kind regards,<br> Wannet Global, Inc.</p>,
        `
      };    


      // ' placed on ' + moment.tz(order.created_on, 'America/Toronto').format('MM-DD-YYYY') + 

    try {
      nodemailer.sendEmail(mailOptions);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Problem sending order confirmation..");
    }
}