import 'package:mysql_client/mysql_client.dart';

abstract class Table {
  abstract String TABLENAME;
  abstract Map<String, String> props;
}

class RecipeTable extends Table {
  String TABLENAME = "recipe";
  String NAME = 'name';
  @override
  Map<String, String> props = {"name": "", "rating": "", "prep_time": ""};

  RecipeTable(Map<String, String> props) {
    this.props = props;
  }
}

class RecipeItemTable extends Table {
  String TABLENAME = "recipe_item";
  Map<String, String> props = {"name": "", "recipe_id": ""};

  RecipeItemTable(Map<String, String> props) {
    this.props = props;
  }
}

class AmountTable extends Table {
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
}
