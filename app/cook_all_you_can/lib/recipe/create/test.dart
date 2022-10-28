import 'package:flutter/material.dart';

import '../../shared/database/interactions.dart';
import '../../shared/database/table.dart';
import '../../shared/shared.dart';
import 'alert.dart';

class Ingredient {
  String name;
  String amount;
  String unit;
  Ingredient(this.name, this.amount, this.unit);
}

class Recipe {
  String name;
  Recipe(this.name);
}

class Homescreen extends StatefulWidget {
  @override
  _State createState() => _State();
}

class _State extends State<Homescreen> {
  List<Recipe> recipes = [];
  List<Ingredient> ingredients = [Ingredient("Zutat 1", "", "")];
  TextEditingController nameController = TextEditingController();
  TextEditingController generalController = TextEditingController();
  int _selectedIndex = 0;

  Future<List<Recipe>> updateRecipes() async {
    recipes = [];
    await Database.selectFrom(RecipeTable({"name": ""})).then((map) {
      for (var entry in map.values) {
        recipes.add(Recipe(entry['name'].toString()));
      }
    });
    return recipes;
  }

  void updateIngredients() {
    setState(() {
      ingredients.add(Ingredient("Zutat", "", ""));
    });
  }

  void submitRecipe() {
    Map<String, String> recipe = {"name": nameController.text};

    if (nameController.text.isEmpty) {
      return;
    }

    Database.insertIntoTable(RecipeTable(recipe))
        .then((value) => updateRecipes());
  }

  Widget _buildPopupDialog(BuildContext context) {
    return AlertDialog(
        title: const Text('Neues Rezept'),
        content: Scaffold(
          body: ListView.builder(
              itemCount: ingredients.length,
              itemBuilder: (BuildContext context, int index) {
                final ingredient = ingredients[index];
                return Container(
                  color: Colors.green,
                  padding: EdgeInsets.all(0),
                  child: Column(
                    children: [Text("d")],
                  ),
                );
              }),
        ),
        actions: <Widget>[
          FloatingActionButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Close'),
          ),
          FloatingActionButton(
            onPressed: () => updateIngredients(),
            child: const Text('Add'),
          )
        ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Flutter Tutorial - googleflutter.com'),
      ),
      body: Column(children: <Widget>[
        Padding(
          padding: EdgeInsets.all(20),
          child: TextField(
            controller: nameController,
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              labelText: 'Rezepttitel',
            ),
          ),
        ),
        FloatingActionButton(
          onPressed: () {
            showDialog(
                context: context,
                builder: (BuildContext context) {
                  return RecipePopUp();
                });
          },
          //submitRecipe();
          backgroundColor: Colors.blueGrey,
          child: const Icon(Icons.add),
        ),
        Expanded(
            child: FutureBuilder<List<Recipe>>(
                future: updateRecipes(),
                builder: (BuildContext context,
                    AsyncSnapshot<List<Recipe>> snapshot) {
                  List<Widget> children = <Widget>[];
                  List<DataRow> rows = [];

                  if (snapshot.hasData) {
                    for (var recipe in recipes) {
                      rows.add(DataRow(cells: <DataCell>[
                        DataCell(Text(recipe.name)),
                      ]));
                    }

                    print("rows " + rows.toString());

                    children.add(DataTable(columns: const <DataColumn>[
                      DataColumn(
                        label: Expanded(
                          child: Text(
                            'Titel',
                            style: TextStyle(fontStyle: FontStyle.italic),
                          ),
                        ),
                      ),
                    ], rows: <DataRow>[
                      ...rows
                    ]));
                  } else if (snapshot.hasError) {
                    children = <Widget>[];
                  } else {
                    children = const <Widget>[];
                  }
                  return Center(
                    child: Column(
                      children: children,
                    ),
                  );
                }))
      ]),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Rezepte',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.business),
            label: 'Einkaufsliste',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        onTap: _onItemTapped,
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }
}
