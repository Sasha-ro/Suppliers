namespace my.suppliers;

entity Suppliers {
  key ID : UUID;
  name    : String(100);
  products: Association to many Products on products.supplier = $self;
}

entity Products {
  key ID : UUID;
  name     : String(100);
  price    : Decimal(9,2);
  discount : Decimal(5,2) default 0;
  supplier : Association to Suppliers;
}
