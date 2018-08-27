const express = require('express');
const app = express();
const path = require('path');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public', 'index.html')));
app.use(express.static('../public'));

app.use(express.json());

app.listen(3000, () => console.log('Example app listening on port 3000!'));

function calc(price, discountType, discount)
{
}

app.post('/calc', (req,res) => {
    let data = req.body;

    let f_price = parseFloat(data.price);
    let discountType = data.discountType;
    let f_discount = parseFloat(data.discount);
    let totalPrice = parseFloat(data.totalPrice);

    let innerPrice = 0;
    if (discountType == "1")
    {
        innerPrice = (f_price*(100-f_discount))/100;
        
    }
    else  {innerPrice = f_price - f_discount;}
    
    totalPrice += parseFloat(innerPrice);
    totalPrice=parseFloat(totalPrice.toFixed(2));
    innerPrice=parseFloat(innerPrice.toFixed(2));

    var my_results = {
        innerPrice: innerPrice,
        totalPrice: totalPrice
    };
    res.setHeader("Content-Type", "application/json");
    res.send(my_results);
    res.end();
});