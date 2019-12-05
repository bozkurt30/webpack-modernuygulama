//Storage Controller
const StorageController = (function () {

    //local storage
    //private


    //public
    return{
        storeProduct: function(product){
            let products;
            if(localStorage.getItem('products')===null){
                products=[];
                products.push(product);
            }else{
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products',JSON.stringify(products));

        },
        //okuma işlemi
        getProducts: function(){
            let products;
            if(localStorage.getItem('products')===null){
                products=[];
            }else{
                products = JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },
        updateProductSC: function(product){
            let products = JSON.parse(localStorage.getItem('products'));
            products.forEach(function(prd,index){
                if(product.id==prd.id){
                    //ilk index sil yerine yeni product ekle
                    products.splice(index,1,product);
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        },
        deleteProductSC: function(id){
            //update benzer
            let products=JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd,index){
                if(id==prd.id){
                    products.splice(index,1);
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        }
        
    }

})();
//Product Controller 
const ProductController = (function () {

    //private

    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    //üstteki product yapıyı kul. data olşt
    const data = {
        //products: [],
        //localstorage devreye girince products: [], değişitrelm
        products : StorageController.getProducts(),
        selectedProduct: null, //listeden ürün secersem seçtüğüim ürünü seçecek
        totalPrice: 0 //toplam fiyatı Listedeki el.
    }

    //public
    return {
        //bir getProduct olş. bu bize products döndürsün
        getProducts: function () {
            return data.products;
        },
        //bir get data olşutur. data döndürsün
        getData: function () {
            return data;
        },
        getProductById: function (id) {

            let product = null; //aradığımız id ilk başta yok diyelm
            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        },
        addProduct: function (name, price) {
            //id bilgisini biz oluşturlam
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }

            //yeni product olşutrlm

            const newProduct = new Product(id, name, parseFloat(price)); //Procut a gön
            //nereye aktarşm Dizi üzere
            //data içindeki products a ekle
            data.products.push(newProduct);
            return newProduct;
        },
        deleteProduct: function (product) {
            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            });
        },
        updateProduct: function (name, price) {
            let product = null;

            data.products.forEach(function (prd) {
                //liste üzerinden gelen prd ile id si, data içndeki selectedProduct id si ile eşitse güncellemek istedğim elemana ulaşmış
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd; //product nesnesi içine güncellediğim elemanı atadık
                }
            });

            return product;

        },
        getTotal: function () {
            let total = 0;
            data.products.forEach(function (item) {
                total += item.price;
            });
            data.totalPrice = total;
            return data.totalPrice;
        }
    }

})();

//UI Controller
const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: ".addBtn",
        updateButton: ".updateBtn",
        cancelButton: ".cancelBtn",
        deleteButton: ".deleteBtn",
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        totaltl: "#total-tl",
        totaldolar: "#total-dolar"
    }

    return { //iiçine yazdğmz değişken, App içinde değişkenden alıyrz
        createProductList: function (products) {
            let html = '';

            //bu html yapısını olşturalm
            products.forEach(prd => {
                html += `
                <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}</td>
                <td class="text-right">
                <i class="far fa-edit edit-product"></i> 
                `;
            });
            //burda bilgileri html içnde id="item-list" gön.
            document.querySelector(Selectors.productList).innerHTML = html; //yukadaki html

        },

        //Yukarda Selectors burda tanımlayalm dışarıya bilgi versn
        getSelectors: function () {
            return Selectors;
        },
        addProductUI: function (prd) {


            document.querySelector(Selectors.productCard).style.display = 'block';
            var item = `
            <tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price}</td>
            <td class="text-right">
            <i class="far fa-edit edit-product"></i>
            </tr>    
            `;

            //doldurduktan sonra
            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProductUI: function (prd) {
            //güncelelyeceğim item tr sine erişmem lazım

            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name; //0. index Id bilgisi. 1. ise name denk glyr
                    item.children[2].textContent = prd.price;
                    updatedItem = item;
                }
            });

            return updatedItem;
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = "",
                document.querySelector(Selectors.productPrice).value = ""
        },
        clearWarningUI: function () {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (prd) {
                if (prd.classList.contains('bg-warning')) { //eğer bg-warning varsa
                    //remove ile kaldır
                    prd.classList.remove('bg-warning');
                }
            });
        },
        //liste boş ise form çizgileri görünmesi
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },

        //topplam sonucun gösterelim
        showTotal: function (total) {
            document.querySelector(Selectors.totaldolar).textContent = total;
            document.querySelector(Selectors.totaltl).textContent = total * 4.5;
        },
        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;

        },
        //hangi butonlar görünmeyecek
        addingState: function (item) {
            /*
                        if(item){
                            item.classList.remove('bg-warning');
                        }*/
            UIController.clearWarningUI();

            UIController.clearInputs(); //ilk önce içi boş olsun
            document.querySelector(Selectors.addButton).style.display = "inline";
            document.querySelector(Selectors.deleteButton).style.display = "none";
            document.querySelector(Selectors.updateButton).style.display = "none";
            document.querySelector(Selectors.cancelButton).style.display = "none";
        },
        deleteProductUI: function () {
            //bana tüm listeyi getir
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            });
        },
        //hangi butonlar görünecek
        editState: function (tr) { //seçmiş old. parametre

            const parent = tr.parentNode;
            for (let i = 0; i < parent.children.length; i++) {
                parent.children[i].classList.remove('bg-warning');
            }
            tr.classList.add('bg-warning'); //clasa renk verdk
            document.querySelector(Selectors.addButton).style.display = "none";
            document.querySelector(Selectors.deleteButton).style.display = "inline";
            document.querySelector(Selectors.updateButton).style.display = "inline";
            document.querySelector(Selectors.cancelButton).style.display = "inline";
        }
        //app ilk çalıştığı anda addingState çalışması gerekr
    }

})();

//uygulamanın çalışacağı yer App olsun
const App = (function (ProductCtrl, UICtrl,StorageCtrl) {

    //uıcont. getselectorları getir
    const UISelectors = UIController.getSelectors();

    //Load EventListener
    //loadEventlis init içinde çağıracaz
    const loadEventListener = function () {
        //product ekleme
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        //edit click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);
        //edit submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

        //cancel
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelProduct);

        //delete
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);

    }

    //productAdd kul

    const productAddSubmit = function (e) {

        //form üzrnde bilgileri alıp productcontrl gön.
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        //gelen value kontrol edelim
        if (productName !== '' && productPrice !== '') {
            //Add product. bir parametre ile ProductCont. yollayalm
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            //şimdi eklediğimz product UI üzerinde ekrana gösterelim
            //addProductUI yukarda tanımlayalım
            UICtrl.addProductUI(newProduct);

            //ekleme işlmi bittikten sonra LocalStorage ekle
            StorageCtrl.storeProduct(newProduct);



            //get total,, getTotalfonk yaz yukarda
            const total = ProductCtrl.getTotal();

            //console.log(total);
            //bunu UI da gösterelim
            UICtrl.showTotal(total);
            //ekleme bittikten sonra, UI içinde fonk yaz
            UICtrl.clearInputs();



        }

        console.log(productName, productPrice);

        e.preventDefault();
    }

    const productEditClick = function (e) {
        //önce icon a erişel
        //id bilgisini aldık
        if (e.target.classList.contains('edit-product')) {

            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //id den sonra Get selected product oluşturalm
            //App module nin içndeym bana bu bilgiyi productControl getirmeli
            const product = ProductCtrl.getProductById(id);

            //Set Currentproduct
            ProductCtrl.setCurrentProduct(product);


            //UI add product
            UICtrl.addProductToForm();

            //submit old ise 
            UICtrl.editState(e.target.parentNode.parentNode);

        }


        e.preventDefault();
    }

    const editProductSubmit = function (e) {

        //productsubmit te bilgileri almştık burda da kullanalm

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        //bunlaro contrl edelm girilmişmi

        if (productName !== '' && productPrice !== '') {
            //update product
            //günceleldiğim bilgiyi geriye döndürmek istyrm
            const updatedProduct = ProductController.updateProduct(productName, productPrice);

            //updateUI

            let item = UICtrl.updateProductUI(updatedProduct);


            //fiyatı güncel
            const total = ProductCtrl.getTotal();
            //show total
            UICtrl.showTotal(total);

            //update storage.. Storage cont bunu oluştur
            StorageCtrl.updateProductSC(updatedProduct);

            UICtrl.addingState(item);
        }

        e.preventDefault();
    }
    //cancel
    const cancelProduct = function (e) {
        UICtrl.addingState();

        e.preventDefault();
    }
    //delete product
    const deleteProductSubmit = function (e) {

        //getcurrent getirelm
        const selectedProduct = ProductCtrl.getCurrentProduct();

        //delete product yaz
        ProductCtrl.deleteProduct(selectedProduct);

        //UI iiçn yapalım
        UICtrl.deleteProductUI();

        //fiyatı günce
        const total = ProductCtrl.getTotal();
        //show total
        UICtrl.showTotal(total);


        //delete LocalStorage

        StorageCtrl.deleteProductSC(selectedProduct.id);


        if (total == 0) {
            UICtrl.hideCard();
        }

        UICtrl.clearInputs();
        UICtrl.addingState();

        e.preventDefault();
    }


    return {
        //app ilk çaştığında
        init: function () {
            console.log('Uygulama başladı...');

            UICtrl.addingState();

            //productconrt gelenleri ekrana yazdıralm
            const products = ProductCtrl.getProducts();

            //hide burda yapl
            if (products.length == 0) {
                UICtrl.hideCard();
            } else {


                //UI üzerine uazsın olştrlam

                UICtrl.createProductList(products);
            }
            const total= ProductCtrl.getTotal();
            UICtrl.showTotal(total);
            //loadeventlistener
            loadEventListener();
        }
    }
})(ProductController, UIController,StorageController);
App.init();