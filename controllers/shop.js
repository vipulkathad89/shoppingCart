const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(result => {
    res.render('shop/product-list', {
      prods: result,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => {
    console.log(err);

  });
  
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findByPk(prodId).then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: "title",
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(result => {
    res.render('shop/index', {
      prods: result,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log(err);

  });
  
};

exports.getCart = (req, res, next) => {

  req.user.getCart().then(cart=>{
    // console.log(cart);
    return cart.getProducts().then(products =>{
         res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: products
            });
    })

  }).catch(err =>console.log(err));

  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchCart;

  req.user.getCart().then(cart =>{
    fetchCart= cart;
    return cart.getProducts({where:{id:prodId}})
  }).then(products=>{
    let product;
    if(products.length > 0){
      product = products[0];
    }
    let newQauntity = 1 ;
    if(product){
      const oldQuantity = product.cartItem.quantity;
       newQauntity = oldQuantity + 1;
       return fetchCart.addProduct(product,{through :{quantity:newQauntity}});

    }

    return Product.findByPk(prodId).then(product =>{
      return fetchCart.addProduct(product,{through :{quantity:newQauntity}});
    })

  }).then(()=>{
    res.redirect('/cart');
  })
  .catch();

  // Product.findByPk(prodId, product => {
  //   Cart.addProduct(prodId, product.price);
  // });
  
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart=>{
    return cart.getProducts({where:{id:prodId}});


  }).then(products=>{
    const product = products[0];
    return product.cartItem.destroy();

  }).then(resutl=>{
    res.redirect('/cart');
  }).catch(err =>{
    console.log(err);
  });
  // Product.findById(prodId, product => {
  //   Cart.deleteProduct(prodId, product.price);
    
  // });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
