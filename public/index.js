
document.addEventListener("DOMContentLoaded", function(event) { 
    addNewInputs();
});
    
var totalPrice = 0;
var itemCount = 0;

function addNewInputs()
{
    let List = document.getElementById("list");

        let br1 = document.createElement('BR');
        br1.setAttribute("id", "br1-"+itemCount);

        let br2 = document.createElement('BR');
        br2.setAttribute("id", "br2-"+itemCount);

        if(itemCount==0)
        {
            br1.style.display = "none";
            br2.style.display = "none";
        }

        List.appendChild(br1);
        List.appendChild(br2);



    
    itemCount++;
    let itemNameInput = document.createElement('input');
    itemNameInput.placeholder = "Item Description";
    itemNameInput.setAttribute("type", "text");
    itemNameInput.setAttribute("id", "itemName-"+itemCount);

    let priceInput = document.createElement('input');
    priceInput.placeholder = "Original Price";
    priceInput.setAttribute("type", "number");
    priceInput.setAttribute("id", "price-"+itemCount);

    let discountType = document.createElement("select");
    discountType.setAttribute("name", "select");
    discountType.setAttribute("id", "discountType-"+itemCount);

    let option1 = document.createElement("option");
    option1.value = "1";
    option1.innerHTML = "precent";
    discountType.appendChild(option1);

    let option2 = document.createElement("option");
    option2.value = "2";
    option2.innerHTML = "amount";
    discountType.appendChild(option2);

    let discountInput = document.createElement('input');
    discountInput.placeholder = "Discount";
    discountInput.setAttribute("type", "text");
    discountInput.setAttribute("id", "discount-"+itemCount);

    let addButton = document.createElement('input');
    addButton.setAttribute("type", "button");
    addButton.setAttribute("id", "addItem-"+itemCount);
    addButton.setAttribute("value", "add");
    
    let removeButton = document.createElement('input');
    removeButton.style.display = "none";
    removeButton.setAttribute("type", "button");
    removeButton.setAttribute("id", "removeItem-"+itemCount);
    removeButton.setAttribute("value", "remove");


    let myAlert = document.createElement("label");
    myAlert.setAttribute("id", "alertName-"+itemCount);

    List.appendChild(itemNameInput);
    List.appendChild(priceInput);
    list.appendChild(discountType);
    List.appendChild(discountInput);
    List.appendChild(addButton);
    List.appendChild(removeButton);
    List.appendChild(myAlert);
    
    document.getElementById("addItem-"+itemCount).setAttribute("onClick", "addItem();");
}

function addItem(itemCountPv = 0)
{
    
    let List = document.getElementById("list");
    if(itemCountPv == 0) itemCountRl = itemCount;
    else itemCountRl = itemCountPv;

    let itemNameInput = document.getElementById("itemName-"+itemCountRl);
    let priceInput = document.getElementById("price-"+itemCountRl);
    let discountType = document.getElementById("discountType-"+itemCountRl);
    let discountInput = document.getElementById("discount-"+itemCountRl);
    let myAlert = document.getElementById("alertName-"+itemCountRl);
    let addButton = document.getElementById("addItem-"+itemCountRl);
    let removeButton = document.getElementById("removeItem-"+itemCountRl);
    
    myAlert.innerHTML = "";
    let nameValue= itemNameInput.value;
    let priceValue= priceInput.value;
    let discountTypeValue= discountType.value;
    let discountValue= discountInput.value;
    if( checkInput(myAlert, nameValue, priceValue, discountTypeValue, discountValue) )
    {
        itemNameInput.disabled  = true;
        priceInput.disabled  = true;
        discountInput.disabled  = true;
        discountType.disabled  = true;
        addButton.setAttribute("value", "edit");
        // let innerPrice = ; ///////call server
        let innerPrice;
        calc(priceValue, discountTypeValue,discountValue).then(
            value => { 
                innerPrice = value;
                document.getElementById("addItem-"+itemCountRl).setAttribute("onClick", "editItem("+itemCountRl+", "+innerPrice+");");

                removeButton.style.display = "inline-block";
                removeButton.setAttribute("onClick", "removeItem("+itemCountRl+", "+innerPrice+");");
                
                myAlert.innerHTML="total price: " + innerPrice;
                if(itemCountPv == 0) addNewInputs();
        
                let showTotal = document.getElementById("totalPrice");
                showTotal.innerHTML = totalPrice;
            },
            err => console.log(err)
        );
    }
}

function editItem(myitemCount, myInnerPrice)
{

    let itemNameInput = document.getElementById("itemName-"+myitemCount);
    let priceInput = document.getElementById("price-"+myitemCount);
    let discountInput = document.getElementById("discount-"+myitemCount);
    let addButton = document.getElementById("addItem-"+myitemCount);
    let discountType = document.getElementById("discountType-"+myitemCount);
    totalPrice -= parseFloat(myInnerPrice);
    itemNameInput.disabled  = false;
    priceInput.disabled  = false;
    discountInput.disabled  = false;
    discountType.disabled  = false;
    addButton.setAttribute("value", "apply");
    addButton.setAttribute("onClick", "addItem("+myitemCount+")");

}

function calc(price, discountType, discount)
{
    var innerPrice;
    let allInputs = {
        price: price,
        discountType: discountType,
        discount: discount,
        totalPrice: totalPrice
    };

    return new Promise((resolve, reject) => {
        let serverRes = request('POST', '/calc', allInputs).then(res=>{
            console.log(res);
            innerPrice=parseFloat(res.innerPrice)
            totalPrice=parseFloat(res.totalPrice)
            resolve(innerPrice);
        });
        serverRes.catch(err => {
            reject(err);
        });
    });
}

function request(method, url, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if(xhr.status == 200) {
                    // success!
                    resolve(JSON.parse(xhr.response));
                } else {
                    // failure :(
                    reject(JSON.parse(xhr.response));
                }
            }
        };
        xhr.addEventListener('error', reject => console.log(reject));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    });
}

function removeItem(myitemCount, myInnerPrice, isAll=false)
{
    if(isAll==false)
    {
    let confirmation = confirm("Are you sure you want to remove this item?");
    
    if(confirmation == false)
    {
        return;
    }
}
    let itemNameInput = document.getElementById("itemName-"+myitemCount);
    let priceInput = document.getElementById("price-"+myitemCount);
    let discountType = document.getElementById("discountType-"+myitemCount);
    let discountInput = document.getElementById("discount-"+myitemCount);
    let myAlert = document.getElementById("alertName-"+myitemCount);
    let addButton = document.getElementById("addItem-"+myitemCount);
    let removeButton = document.getElementById("removeItem-"+myitemCount);

    let rmbr1 = document.getElementById("br1-"+myitemCount);
    let rmbr2 = document.getElementById("br2-"+myitemCount);

    itemNameInput.style.display = "none";
    priceInput.style.display = "none";
    discountType.style.display = "none";
    discountInput.style.display = "none";
    myAlert.style.display = "none";
    addButton.style.display = "none";
    removeButton.style.display = "none";
    rmbr1.style.display = "none";
    rmbr2.style.display = "none";

    totalPrice -= parseFloat(myInnerPrice);
    let showTotal = document.getElementById("totalPrice");
    showTotal.innerHTML = totalPrice;
}

function checkInput(myAlert, nameValue, priceValue, discountTypeValue, discountValue)
{
    if(nameValue == "" || priceValue == "" || discountTypeValue == "" || discountValue=="")
    {
        myAlert.innerHTML = "Please insert all the fields properly";
        return 0;
    }
    if (isNaN(priceValue) || parseInt(priceValue) < 0)
    {
        myAlert.innerHTML = "Price should be a positive number";
        return 0;
    }
    if(discountTypeValue=="1")
    {
        if ( isNaN(discountValue) ||  parseInt(discountValue) < 0 ||  parseInt(discountValue) > 100)
        {

            myAlert.innerHTML = "precent should be a number between 0-100";
            return 0;
        }
    }
    else
    {
        if ( isNaN(discountValue) ||  parseInt(discountValue) < 0 ||  parseInt(discountValue) >  parseInt(priceValue))
        {
            myAlert.innerHTML = "discount Value is not valid";
            return 0;
        }
    }
    return 1;
}

function removeAll()
{
    let confirmation = confirm("Are you sure you want to remove all item?");
    if(confirmation == false)
    {
        return;
    }
        for(let i = 1; i< itemCount;i++)
        {
            removeItem(i,0,true);
        }
        totalPrice=0;
        let showTotal = document.getElementById("totalPrice");
        showTotal.innerHTML = totalPrice;
}

