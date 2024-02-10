import 'dart:async';
import 'dart:developer';
import 'dart:io';

import 'package:cook_all_you_can/index/pages/shared/service/service.dart';
import 'package:cook_all_you_can/index/pages/shared/settings/theme/theme.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../overview/recipe/show/show.dart';
import 'database/table.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Validator for createRecipe
String? validateTextForm(String? value) {
  if (value == null || value.isEmpty) {
    return 'Bitte ausfüllen oder Feld entfernen falls möglich';
  }
  return null;
}

ScaffoldFeatureController<SnackBar, SnackBarClosedReason> showNotification(
    BuildContext context, String message,
    [Color? bgcolor]) {
  return ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
        backgroundColor: bgcolor ?? MyThemes.primaryColor,
        content: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Flexible(
                child: Text(message,
                    style:
                        // message,
                        TextStyle(
                      color: MyThemes.secondaryColor,
                    ))),
            CircularProgressIndicator(color: Colors.black)
          ],
        )),
  );
}

onLoading(BuildContext context) {
  return showDialog(
    context: context,
    barrierDismissible: false,
    builder: (BuildContext context) {
      return Dialog(
        child: new Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            new CircularProgressIndicator(),
            new Text("Loading"),
          ],
        ),
      );
    },
  );
}

@override
Widget buildUnitDropdownMenu(BuildContext context, dynamic dropdownValue,
    List<String> list, Function setState) {
  return Flexible(
      flex: 1,
      child: DropdownButton<String>(
        value: dropdownValue,
        elevation: 16,
        style: const TextStyle(fontSize: 16),
        underline: Container(
          height: 2,
          width: 10,
        ),
        onChanged: (String? value) {
          // This is called when the user selects an item.
          setState(() {
            dropdownValue = value!.toString();
          });
        },
        items: list.map((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
      ));
}

/* @deprecated */
WholeRecipeContent dummyWholeRecipe = new WholeRecipeContent(
    new Recipe("", 0, 0, 0, "", 0), [], new RecipeManual(0, 0), [], []);

List<String> unitsForIngredient = <String>[
  'g',
  'ml',
  'Stück',
  'Prise',
  'TL',
  'EL',
  'Dose',
  'Msp',
  'Packung',
  'Scheibe',
  'Buendel'
];
List<String> defaultUnit = ['g'];

confirmRemovePopUp(BuildContext context) async {
  var future;
  return showDialog<bool>(
    context: context,
    barrierDismissible: false, // user must tap button!
    builder: (BuildContext context) {
      return AlertDialog(
        content: SingleChildScrollView(
          child: ListBody(
            children: const <Widget>[
              Text('Willst du das Rezept wirklich entfernen?'),
            ],
          ),
        ),
        actions: <Widget>[
          Row(
            children: [
              Column(
                children: [
                  TextButton(
                    child: const Text('Ja'),
                    onPressed: () {
                      Navigator.of(context).pop(true);
                    },
                  ),
                ],
              ),
              Spacer(),
              Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    child: const Text('Nein'),
                    onPressed: () {
                      Navigator.of(context).pop(false);
                    },
                  ),
                ],
              )
            ],
          )
        ],
      );
    },
  );
}

createPopUp() async {
  return AlertDialog(
    content: SingleChildScrollView(
      child: ListBody(
        children: const <Widget>[
          Text('Willst du das Rezept wirklich entfernen?'),
        ],
      ),
    ),
    actions: <Widget>[
      Row(
        children: [
          Column(
            children: [
              TextButton(
                child: const Text('Ja'),
                onPressed: () {
                  // Navigator.of(context).pop(true);
                },
              ),
            ],
          ),
          Spacer(),
          Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(
                child: const Text('Nein'),
                onPressed: () {
                  // Navigator.of(context).pop(false);
                },
              ),
            ],
          )
        ],
      )
    ],
  );
}

Future<List<Recipe>> updateRecipes() async {
  final supabase = Supabase.instance.client;
  List<Recipe> recipes = [];
  await supabase
      .from(RecipeTable().TABLENAME)
      .select('name, prep_time, number_of_people, id,created_from_household')
      .then((value) => {
            for (var i = 0; i < value.length; i++)
              {
                recipes.add(
                  Recipe(
                      value[i]['name'].toString(),
                      value[i]['prep_time'] != null
                          ? value[i]['prep_time'].toString() + ' Min.'
                          : '-',
                      value[i]['rating'] != null
                          ? value[i]['rating'].toString()
                          : '-',
                      value[i]['number_of_people'],
                      value[i]['created_from_household'],
                      value[i]['id']),
                )
              }
          })
      .whenComplete(() {
    return new Future.value(recipes);
  });

  return new Future.value(recipes);
}

createBasicAlertDialog(BuildContext context, String text) {
  // Scaffold is a layout for
  // the major Material Components.
  return showDialog<bool>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(text),
              ],
            ),
          ),
          actions: <Widget>[
            Row(
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    TextButton(
                      child: const Text('Nein'),
                      onPressed: () {
                        Navigator.of(context).pop(false);
                      },
                    ),
                  ],
                ),
                Spacer(),
                Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      child: const Text('Ja'),
                      onPressed: () {
                        Navigator.of(context).pop(true);
                      },
                    ),
                  ],
                ),
              ],
            )
          ],
        );
      });
}

class CheckboxFormField extends FormField<bool> {
  CheckboxFormField(
      {Widget? title,
      FormFieldSetter<bool>? onSaved,
      FormFieldValidator<bool>? validator,
      bool initialValue = false,
      bool autovalidate = false})
      : super(
            onSaved: onSaved,
            validator: validator,
            initialValue: initialValue,
            builder: (FormFieldState<bool> state) {
              return CheckboxListTile(
                dense: state.hasError,
                title: title,
                value: state.value,
                onChanged: state.didChange,
                subtitle: state.hasError
                    ? Builder(
                        builder: (BuildContext context) => Text(
                          state.errorText ?? "",
                          style: TextStyle(
                              color: Theme.of(context).colorScheme.error),
                        ),
                      )
                    : null,
                controlAffinity: ListTileControlAffinity.leading,
              );
            });
}

class Ingredient {
  String name;
  String amount;
  String unit;
  Ingredient(this.name, this.amount, this.unit);
}

class Recipe {
  String name;
  dynamic prep_time;
  dynamic rating;
  int number_of_people;
  String created_from_household;
  int id;

  List<Category>? category;

  Recipe(this.name, this.prep_time, this.rating, this.number_of_people,
      this.created_from_household, this.id,
      [this.category]);
}

class RecipeItem {
  String name;
  int recipe_id;
  int id;
  RecipeItem(this.name, this.recipe_id, this.id);
}

class RecipeAmount {
  int recipe_item_id;
  int recipe_id;
  double amount;
  String unit;
  RecipeAmount(this.recipe_item_id, this.recipe_id, this.amount, this.unit);
}

class RecipeManual {
  int steps;
  int recipe_id;
  RecipeManual(this.steps, this.recipe_id);
}

class RecipeManualStep {
  int id;
  int manual_id;
  String step;
  RecipeManualStep(this.id, this.manual_id, this.step);
}

class CustomUserSettings {
  int id;
  String primaryColor;
  String secondaryColor;

  CustomUserSettings(this.id, this.primaryColor, this.secondaryColor);
}

class CounterStorage {
  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path;
  }

  Future<File> get _localFile async {
    final path = await _localPath;
    return File('$path/variables.txt');
  }

  Future<String> readCounter(File file) async {
    try {
      final file = await _localFile;

      // Read the file
      final contents = await file.readAsString();

      return contents;
    } catch (e) {
      // If encountering an error, return 0
      return "";
    }
  }

  Future<File> write(String filepath, String id) async {
    final path = await _localPath;
    final file = new File(path + '/' + filepath + '.txt');

    // Write the file
    return file.writeAsString('$id');
  }

  Future<String> read(String filepath) async {
    // final file = await _localFile;
    final path = await _localPath;
    final file = new File(path + '/' + filepath + '.txt');

    // Write the file
    final contents = await file.readAsString();

    return contents;
  }
}

// Future<String?> loadDeviceData(String id) async {
//   var prefs;
//   // prefs = await SharedPreferences.getInstance().onError((error, stackTrace) {
//   //   // debugger();
//   //   return Future.value();
//   // });
//   // debugger();
//   prefs = await SharedPreferences?.getInstance();
//   return prefs.getString(id) ?? null;
// }

//Incrementing counter after click
Future<void> saveDataOnDevice2(String id, String value) async {
  // final SharedPreferences prefs =
  await SharedPreferences.getInstance().onError((error, stackTrace) {
    debugPrintStack(stackTrace: stackTrace);
    debugger();
    throw new Error();
  });
  debugger();
  // await prefs.setString(id, value);
}

// Future<void> saveDataOnDevice(String id, String value) async {
//   final SharedPreferences prefs = await SharedPreferences.getInstance();
//   await prefs.clear();
//   prefs.setString(id, value);
// }

parseColorStringToColor(String? color) {
  if (color!.length == 0) {
    return null;
  }

  String valueString = color.split('(0x')[1].split(')')[0];
  int value = int.parse(valueString, radix: 16);
  return Color(value);
}

const MaterialColor kToDark = const MaterialColor(
  0xffe55f48, // 0% comes in here, this will be color picked if no shade is selected when defining a Color property which doesn’t require a swatch.
  const <int, Color>{
    50: const Color(0xffce5641), //10%
    100: const Color(0xffb74c3a), //20%
    200: const Color(0xffa04332), //30%
    300: const Color(0xff89392b), //40%
    400: const Color(0xff733024), //50%
    500: const Color(0xff5c261d), //60%
    600: const Color(0xff451c16), //70%
    700: const Color(0xff2e130e), //80%
    800: const Color(0xff170907), //90%
    900: const Color(0xff000000), //100%
  },
);

/// Flutter code sample for [SearchBar].

void main() => runApp(const SearchBarApp());

class SearchBarApp extends StatefulWidget {
  const SearchBarApp({super.key});

  @override
  State<SearchBarApp> createState() => _SearchBarAppState();
}

class _SearchBarAppState extends State<SearchBarApp> {
  bool isDark = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData themeData = ThemeData(
        useMaterial3: true,
        brightness: isDark ? Brightness.dark : Brightness.light);

    return Scaffold(
      appBar: AppBar(title: const Text('Search Bar Sample')),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: SearchAnchor(
            builder: (BuildContext context, SearchController controller) {
          return SearchBar(
            controller: controller,
            padding: const MaterialStatePropertyAll<EdgeInsets>(
                EdgeInsets.symmetric(horizontal: 16.0)),
            onTap: () {
              controller.openView();
            },
            onChanged: (_) {
              controller.openView();
            },
            leading: const Icon(Icons.search),
            trailing: <Widget>[
              Tooltip(
                message: 'Change brightness mode',
                child: IconButton(
                  isSelected: isDark,
                  onPressed: () {
                    setState(() {
                      isDark = !isDark;
                    });
                  },
                  icon: const Icon(Icons.wb_sunny_outlined),
                  selectedIcon: const Icon(Icons.brightness_2_outlined),
                ),
              )
            ],
          );
        }, suggestionsBuilder:
                (BuildContext context, SearchController controller) {
          return List<ListTile>.generate(5, (int index) {
            final String item = 'item $index';
            return ListTile(
              title: Text(item),
              onTap: () {
                setState(() {
                  controller.closeView(item);
                });
              },
            );
          });
        }),
      ),
    );
  }
}
