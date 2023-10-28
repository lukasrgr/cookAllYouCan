class Service {
  static late User user = new User('anon', 'anon', 0);
  static late List<Category> category = [];
}

class User {
  String userName;
  String household;
  int household_id;
  User(this.userName, this.household, this.household_id);

  setHousehold(String household, int household_id) {
    this.household = household;
    this.household_id = household_id;
  }

  setUserName(String userName) {
    this.userName = userName;
  }
}

// Resembles many to many - recipe and category
class Category {
  int id;
  String name;

  Category(this.id, this.name);
}
