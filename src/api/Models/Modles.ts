import { objectType } from "@nexus/schema";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.avatar();
    t.model.name();
    t.model.role();
    t.model.address({
      type: "Address",
    });
    t.model.permissions();
    t.model.cart({
      type: "CartItem",
    });
    t.model.likes({
      type: "Like",
    });
    t.model.likesCount();
    t.model.itemReview({
      type: "Review",
    });
    t.model.reviewCount();
  },
});
export const Seller = objectType({
  name: "Seller",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.email();
    t.model.storeName();
    t.model.sellerNationality();
    t.model.sellerIdentification();
    t.model.EmailIsVerified();
    t.model.SellerItemsCout();
    t.model.role();
    t.model.phone();
    t.model.PickupLocations({
      type: "Address",
    });
    t.model.Brand();
    t.model.items({
      type: "Item",
    });
    t.model.permissions();
  },
});

export const Like = objectType({
  name: "Like",
  definition(t) {
    t.model.id();
    t.model.user();
    t.model.userId();
    t.model.item({
      type: "Item",
    });
    t.model.itemId();
  },
});
export const ItemImage = objectType({
  name: "ItemImage",
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.largeUrl();
    t.model.item({
      type: "Item",
    });
    t.model.itemId();
  },
});
export const CartItem = objectType({
  name: "CartItem",
  definition(t) {
    t.model.id();
    t.model.quantity();
    t.model.item({
      type: "Item",
    });
    t.model.itemId();
    t.model.user();
    t.model.userId();
  },
});
export const Order = objectType({
  name: "Order",
  definition(t) {
    t.model.id();
    t.model.items({
      type: "OrderItem",
    });
    t.model.itemId();
    t.model.total();
    t.model.user();
    t.model.userId();
    t.model.charge();
    t.model.status();
  },
});
export const Item = objectType({
  name: "Item",
  definition(t) {
    t.model.id();
    t.model.likes({
      type: "Like",
    });
    t.model.likesCount();
    t.model.itemReview({
      type: "Review",
    });
    t.model.reviewCount();
    t.model.images({
      type: "ItemImage",
    });
    t.model.catagory({
      type: "Catagory",
    });
    t.model.tags({
      type: "Tags",
    });
    t.model.colors({
      type: "Colors",
    });
    t.model.oherFeatures({
      type: "OherFeatures",
    });
    t.model.title();
    t.model.description();
    t.model.overview();
    t.model.otherInfo();
    t.model.videoLink();
    t.model.brand();
    t.model.weight();
    t.model.dimensions();
    t.model.materials();
    t.model.price();
    t.model.beforeDiscountPrice();
    t.model.stock();
  },
});
export const OrderItem = objectType({
  name: "OrderItem",
  definition(t) {
    t.model.id();
    t.model.likes({
      type: "Like",
    });
    t.model.itemReview({
      type: "Review",
    });
    t.model.images({
      type: "ItemImage",
    });
    t.model.catagory({
      type: "Catagory",
    });
    t.model.tags({
      type: "Tags",
    });
    t.model.colors({
      type: "Colors",
    });
    t.model.oherFeatures({
      type: "OherFeatures",
    });
    t.model.title();
    t.model.description();
    t.model.overview();
    t.model.otherInfo();
    t.model.videoLink();
    t.model.brand();
    t.model.weight();
    t.model.dimensions();
    t.model.materials();
    t.model.price();
    t.model.beforeDiscountPrice();
    t.model.stock();
  },
});
export const Catagory = objectType({
  name: "Catagory",
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.item({
      type: "Item",
    });
    t.model.itemId();
  },
});
export const Tags = objectType({
  name: "Tags",
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.item({
      type: "Item",
    });
    t.model.itemId();
  },
});
export const Colors = objectType({
  name: "Colors",
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.item({
      type: "Item",
    });
    t.model.itemId();
  },
});
export const OherFeatures = objectType({
  name: "OherFeatures",
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.item({
      type: "Item",
    });
    t.model.itemId();
  },
});
export const Review = objectType({
  name: "Review",
  definition(t) {
    t.model.id();
    t.model.item({
      type: "Item",
    });
    t.model.itemId();
    t.model.author();
    t.model.authorId();
    t.model.rating();
    t.model.text();
  },
});
export const Address = objectType({
  name: "Address",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.address();
    t.model.country();
    t.model.state();
    t.model.city();
    t.model.streetAddress1();
    t.model.streetAddress2();
    t.model.zipCode();
    t.model.company();
    t.model.message();
    t.model.additionalInfo();
    t.model.MaincontactNubmer();
    t.model.OthercontactNubmers();
    t.model.isPrimary();
    t.model.Lat();
    t.model.Lng();
    t.model.User({
      type: "User",
    });
  },
});
