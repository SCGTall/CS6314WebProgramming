INSERT INTO ADMIN (AccountID, Fname, Lname, DateOfBirth, Email, UserName, Password, Phone)
	VALUES (0, 'Charles', 'Lee', '01/01/1997', 'chalee@gmail.com', 'adminL', '$2b$10$OevNVIaABJZn/n9FNolEiurdtfyHnti/KKmuV6X488uXiIsBrDGgu', '9955654039');
INSERT INTO ADMIN (AccountID, Fname, Lname, DateOfBirth, Email, UserName, Password, Phone)
	VALUES (1, 'Admin', 'Test', '01/01/2000', 'admin@test.com', 'testa', '$2b$10$OevNVIaABJZn/n9FNolEiu681PDnwfsGsCGXzhlwHU91Ma4N7FkR.', '5476014382');

INSERT INTO CUSTOMER (AccountID, Fname, Lname, DateOfBirth, Email, UserName, Password, Card, ExpDate, SecCode, Street, City, Zip, State, Phone)
	VALUES (100, 'Medhurst', 'Tess', '01/29/1991', 'medtes@gmail.com', 'medtes', '$2b$10$OevNVIaABJZn/n9FNolEiu.Urct5C5OsuBjai1sx4GMHVnUnQ1IZC', '4829571662449868', '01/22', '457', '4494 Wilson Avenue', 'Plano', '75023', 'TX', '7112659193');
INSERT INTO CUSTOMER (AccountID, Fname, Lname, DateOfBirth, Email, UserName, Password, Card, ExpDate, SecCode, Street, City, Zip, State, Phone)
	VALUES (101, 'Hayes', 'Mitchel', '07/17/1972', 'haymit@gmail.com', 'haymit', '$2b$10$OevNVIaABJZn/n9FNolEiufPFRtMIMll4ntHan9H9C2XbhkbSn/Yu', '5487744475243527', '10/23', '876', '932 Worthington Drive', 'Plano',  '75074', 'TX', '6758447400');
INSERT INTO CUSTOMER (AccountID, Fname, Lname, DateOfBirth, Email, UserName, Password, Card, ExpDate, SecCode, Street, City, Zip, State, Phone)
	VALUES (102, 'Hegmann', 'Louie', '12/28/1994', 'heglou@outlook.com', 'heglou', '$2b$10$OevNVIaABJZn/n9FNolEiue80xxPcdZtpN2zv7QwUTjZA3apuXy.K', '5132304934743739', '07/23', '283', '4223 Jones Street', 'Plano',  '75074', 'TX', '2668550710');
INSERT INTO CUSTOMER (AccountID, Fname, Lname, DateOfBirth, Email, UserName, Password, Card, ExpDate, SecCode, Street, City, Zip, State, Phone)
	VALUES (103, 'Customer', 'Test', '01/01/2000', 'customer@test.com', 'testc', '$2b$10$OevNVIaABJZn/n9FNolEiu681PDnwfsGsCGXzhlwHU91Ma4N7FkR.', '1111222233334444', '12/48', '123', '1234 Test Street', 'Plano',  '75080', 'TX', '1112223333');
INSERT INTO CUSTOMER (AccountID, Fname, Lname, DateOfBirth, Email, UserName, Password, Card, ExpDate, SecCode, Street, City, Zip, State, Phone)
	VALUES (104, 'Customer', 'Test', '01/01/2000', 'customer2@test.com', 'testc2', '$2b$10$OevNVIaABJZn/n9FNolEiu681PDnwfsGsCGXzhlwHU91Ma4N7FkR.', '1111222233334444', '12/28', '123', '1234 Test Street', 'Plano',  '75080', 'TX', '1112223333');

INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(1001, 'Coconut Bread', 3.5, 'A soft bread with coconut and cheese filling, topped with sliced cashew.', 'CoconutBread.jpg', 20, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(1002, 'Garlic Cheese', 2.8, 'A soft bread topped with special garlic spread, mozzarella cheese, and sprinkled with chopped chives.', 'GarlicCheese.jpg', 20, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(1003, 'Coffee Bread', 3.7, 'A coffee flavored bread filled with special cream cheese.', 'CoffeeBread.jpg', 20, 0);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(1004, 'Whole Milk Bread', 5.2, 'A soft, moist Japanese style bread with buttery and milky flavor.', 'WholeMilkBread.jpg', 20, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(1005, 'Berry Fairy', 3.4, 'Sweet bread with fresh strawberry and special cream.', 'BerryFairy.jpg', 20, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(1006, 'Taro Taro', 3.7, 'Sweet bread made with mixed grains and filled with signature taro filling.', 'TaroTaro.jpg', 20, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(1007, 'Butter Bread', 2.8, 'Golden bread baked with salted butter. Sprinkled with sea salt to make it simply delicious.', 'ButterBread.jpg', 20, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(2001, 'Blueberry Cheesecake', 4.3, 'Moist and rich cheesecake with blueberry jam based with a cookie crumble bottom.', 'BlueberryCheesecake.jpg', 15, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(2002, 'Black Forest Slice', 3.6, 'Chocolate sponge cake with sweet cherries and fresh cream.', 'BlackForestSlice.jpg', 15, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(2003, 'Red Velvet Slice', 3.7, '3-layered red velvet cake with vanilla cream cheese and red velvet crumbs. Decorated with white chocolate shavings and cherries.', 'RedVelvetSlice.jpg', 15, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(2004, 'Coconut Roll', 5.2, 'Vanilla flavored sponge roll filled with fresh vanilla cream and surrounded by coconut shavings.', 'CoconutRoll.jpg', 10, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(2005, 'Chocolate Roll', 5.5, 'Chocolate flavored sponge roll with fresh cream.', 'ChocolateRoll.jpg', 10, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(3001, 'Americano', 2.7, 'Espresso based black coffee.', 'Americano.jpg', 10, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(3002, 'Caramel Macchiato', 3.2, 'Espresso with steamed milk and caramel sauce.', 'CaramelMacchiato.jpg', 10, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(3003, 'Boba Milk Tea', 3.5, 'Black tea with fresh milk, cream and boba.', 'BobaMilkTea.jpg', 10, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(3004, 'Iced Fruit Tea', 3.7, 'Jasmine green tea with fresh peach pulp.', 'IcedFruitTea.jpg', 10, 1);
INSERT INTO PRODUCT(ProductID, Name, Price, Description, Image, Num, Visible)
	VALUES(3005, 'Iced Coffee', 3.2, 'Iced Sweetened Americano with sea salt cream.', 'IcedCoffee.jpg', 10, 1);

INSERT INTO CATEGORY (CategoryID, Name)
	VALUES (0, 'Bread');
INSERT INTO CATEGORY (CategoryID, Name)
	VALUES (1, 'Cake');
INSERT INTO CATEGORY (CategoryID, Name)
	VALUES (2, 'Drink');
	
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(1001, 0);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(1002, 0);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(1003, 0);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(1004, 0);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(1005, 0);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(1006, 0);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(1007, 0);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(2001, 1);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(2002, 1);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(2003, 1);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(2004, 1);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(2005, 1);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(3001, 2);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(3002, 2);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(3003, 2);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(3004, 2);
INSERT INTO PRODUCT_OWN_CATEGORY(ProductID, CategoryID)
	VALUES(3005, 2);

INSERT INTO FOOD_ORDER (OrderID, AccountID, PurchaseDate, TotalPrice)
	VALUES (80001, 100, '11/18/2020', 13.9);
INSERT INTO FOOD_ORDER (OrderID, AccountID, PurchaseDate, TotalPrice)
	VALUES (80002, 100, '11/20/2020', 6.2);
INSERT INTO FOOD_ORDER (OrderID, AccountID, PurchaseDate, TotalPrice)
	VALUES (80003, 100, '11/22/2020', 16.8);
INSERT INTO FOOD_ORDER (OrderID, AccountID, PurchaseDate, TotalPrice)
	VALUES (80004, 103, '11/25/2020', 15.8);
INSERT INTO FOOD_ORDER (OrderID, AccountID, PurchaseDate, TotalPrice)
	VALUES (80005, 103, '11/25/2020', 26.0);
INSERT INTO FOOD_ORDER (OrderID, AccountID, PurchaseDate, TotalPrice)
	VALUES (80006, 102, '11/25/2020', 17.0);

INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80001, 1001, 3);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80001, 1005, 1);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80002, 3001, 1);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80002, 3003, 1);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80003, 1002, 1);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80003, 2002, 1);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80003, 2004, 2);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80004, 1006, 2);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80004, 1007, 3);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80005, 1004, 2);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80005, 2004, 3);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80006, 1006, 2);
INSERT INTO ORDER_OWN_PRODUCT (OrderID, ProductID, Num)
	VALUES (80006, 3005, 3);

INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80001, 1001, 'Coconut Bread', 3.5, 3);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80001, 1005, 'Berry Fairy', 3.4, 1);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80002, 3001, 'Americano', 2.7, 1);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80002, 3003, 'Boba Milk Tea', 3.5, 1);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80003, 1002, 'Garlic Cheese', 2.8, 1);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80003, 2002, 'Black Forest Slice', 3.6, 1);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80003, 2004, 'Coconut Roll', 5.2, 2);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80004, 1006, 'Taro Taro', 3.7, 2);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80004, 1007, 'Butter Bread', 2.8, 3);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80005, 1004, 'Whole Milk Bread', 5.2, 2);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80005, 2004, 'Coconut Roll', 5.2, 3);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80006, 1006, 'Taro Taro', 3.7, 2);
INSERT INTO ORDER_DETAIL (OrderID, ProductID, Name, Price, Num)
	VALUES (80006, 3005, 'Iced Coffee', 3.2, 3);

INSERT INTO CART (AccountID)
	VALUES (101);
INSERT INTO CART (AccountID)
	VALUES (103);

INSERT INTO CART_OWN_PRODUCT (AccountID, ProductID, Num)
	VALUES (101, 1002, 2);
INSERT INTO CART_OWN_PRODUCT (AccountID, ProductID, Num)
	VALUES (101, 2001, 2);
INSERT INTO CART_OWN_PRODUCT (AccountID, ProductID, Num)
	VALUES (101, 2002, 2);
INSERT INTO CART_OWN_PRODUCT (AccountID, ProductID, Num)
	VALUES (103, 3001, 2);
INSERT INTO CART_OWN_PRODUCT (AccountID, ProductID, Num)
	VALUES (103, 1003, 10);

INSERT INTO FAVORITE (AccountID)
	VALUES (103);

INSERT INTO FAVORITE_OWN_PRODUCT (AccountID, ProductID)
	VALUES (103, 3003);

