import 'package:cook_all_you_can/index/pages/shared/service/service.dart';
import 'package:sqflite/sqflite.dart';

class SqfLiteHandler {
  /** Recipe_Filter */
  static Future<void> insertFilter(Recipe_Filter filter) async {
    // Get a reference to the database.
    final db = await openDatabase('user_database.db');

    // Insert the Dog into the correct table. You might also specify the
    // `conflictAlgorithm` to use in case the same dog is inserted twice.
    //
    // In this case, replace any previous data.
    await db.insert(
      'recipe_filter',
      filter.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  static Future<List<Recipe_Filter>> getRecipeFilter() async {
    // Get a reference to the database.
    final db = await openDatabase('user_database.db');
    // Query the table for all The Dogs.
    final List<Map<String, dynamic>> maps = await db.query('recipe_filter');

    if (maps.isEmpty) {
      return Service.filter;
    }

    var user = maps[0];

    // Convert the List<Map<String, dynamic> into a List<Dog>.
    return []; //(user['id'], user['userName'], user['password'],
    //user['household'], user['household_id']);
  }

  /** User */
  static Future<void> insertUser(User user) async {
    // Get a reference to the database.
    final db = await openDatabase('user_database.db');

    // Insert the Dog into the correct table. You might also specify the
    // `conflictAlgorithm` to use in case the same dog is inserted twice.
    //
    // In this case, replace any previous data.
    await db.insert(
      'user',
      user.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  // A method that retrieves all the dogs from the dogs table.
  static Future<User> getUsers() async {
    // Get a reference to the database.
    final db = await openDatabase('user_database.db');
    // Query the table for all The Dogs.
    final List<Map<String, dynamic>> maps = await db.query('user');

    if (maps.isEmpty) {
      return Service.user;
    }

    var user = maps[0];

    // Convert the List<Map<String, dynamic> into a List<Dog>.
    return User(user['id'], user['userName'], user['password'],
        user['household'], user['household_id']);
  }

  static Future<void> deleteUser(int id) async {
    // Get a reference to the database.
    final db = await openDatabase('user_database.db');
    // Remove the Dog from the database.
    await db.delete('user',
        where: 'id = ?',
        // Pass the Dog's id as a whereArg to prevent SQL injection.
        whereArgs: [id]);

    return Future.value();
  }
}
