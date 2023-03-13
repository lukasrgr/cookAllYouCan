abstract class DatabaseTable {
  abstract String TABLENAME;
  abstract Map<String, String> props;

  toJson(dynamic argument1, dynamic argument2);
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
  String TABLENAME = "amount";
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
