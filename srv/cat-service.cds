using my.suppliers as db from '../db/schema';

// Unbound action to count Suppliers and Products
type EntityCounts : {
  supplierCount : Integer;
  productCount  : Integer;
};

service CatalogService {
  // Project only scalar fields for Suppliers to avoid projection of to-many association
  entity Suppliers as projection on db.Suppliers { ID, name };
  // Expose Products (includes supplier association which is to-one)
  entity Products  as projection on db.Products;
  // Bound action to get a short review for a supplier (returns plain text)
  action supplierReviews( supplier: Suppliers ) returns String;

  action countEntities( ) returns EntityCounts;
}
