class Service {
  static late User user = new User('anon', 'anon', 0);
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
