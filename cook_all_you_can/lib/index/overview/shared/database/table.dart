abstract class DatabaseTable {
  abstract String TABLENAME;

  toJson(dynamic argument1, dynamic argument2);
}

class CalendarTable {
  String TABLENAME = "calendar";
}

class CalendarDayWithEvent {
  String TABLENAME = "calendar_day_with_event";
}

class RecipeTable extends DatabaseTable {
  String TABLENAME = "recipe";
  String NAME = 'name';

  // RecipeTable(Map<String, String> props) {
  //   this.props = props;
  // }

  @override
  Map<String, String> props = {"name": "", "prep_time": ""};

  @override
  toJson(dynamic name, dynamic prep_time) {
    // TODO: implement toJson
    return {'name': name, "prep_time": prep_time};
  }
}

class RecipeItemTable extends DatabaseTable {
  String TABLENAME = "recipe_item";
  Map<String, String> props = {"name": "", "recipe_id": ""};

  // RecipeItemTable(Map<String, String> props) {
  //   this.props = props;
  // }

  @override
  toJson(dynamic argument1, dynamic argument2) {
    // TODO: implement toJson
    throw UnimplementedError();
  }
}

class AmountTable extends DatabaseTable {
  String TABLENAME = "recipe_item_amount";
  Map<String, String> props = {
    "amount": "",
    "recipe_id": "",
    "recipe_item_id": "",
    "unit": ""
  };

  RecipeItemTable(Map<String, String> props) {
    this.props = props;
  }

  @override
  toJson(dynamic argument1, dynamic argument2) {
    // TODO: implement toJson
    throw UnimplementedError();
  }
}

class ShoppingListFromRecipes extends DatabaseTable {
  @override
  String TABLENAME = 'shopping_list_from_recipes';

  @override
  toJson(argument1, argument2) {
    // TODO: implement toJson
    throw UnimplementedError();
  }
}

class ShoppingListItems extends DatabaseTable {
  @override
  String TABLENAME = 'shopping_list_items';

  @override
  toJson(argument1, argument2) {
    // TODO: implement toJson
    throw UnimplementedError();
  }
}

class ShoppingListGeneral extends DatabaseTable {
  @override
  String TABLENAME = 'shopping_list_general';

  @override
  toJson(argument1, argument2) {
    // TODO: implement toJson
    throw UnimplementedError();
  }
}

class UserCustomSettings extends DatabaseTable {
  @override
  String TABLENAME = 'user_custom_settings';

  @override
  toJson(argument1, argument2) {
    // TODO: implement toJson
    throw UnimplementedError();
  }
}
