import 'dart:collection';
import 'dart:io';

import 'package:cook_all_you_can/index/overview/shared/database/table.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:table_calendar/table_calendar.dart';

import '../overview/recipe/show/showRecipe.dart';
import '../shared/service/service.dart';
import '../shared/settings/theme/theme.dart';
import '../shared/shared.dart';
import '../shared/utils.dart';

class Calendar extends StatefulWidget {
  const Calendar({super.key});

  @override
  State<Calendar> createState() => _CalendarState();
}

class _CalendarState extends State<Calendar> {
  final supabase = Supabase.instance.client;
  List<Recipe> recipes = [];
  var recipes2;

  late final ValueNotifier<List<Event>> _selectedEvents;
  CalendarFormat _calendarFormat = CalendarFormat.month;
  RangeSelectionMode _rangeSelectionMode = RangeSelectionMode
      .toggledOff; // Can be toggled on/off by longpressing a date
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  DateTime? _rangeStart;
  DateTime? _rangeEnd;

  String dropdownValue = '1';

  var events = LinkedHashMap<DateTime, List<Event>>(
    equals: isSameDay,
    hashCode: getHashCode,
  );

  @override
  void initState() {
    super.initState();

    _selectedDay = _focusedDay;
    _selectedEvents = ValueNotifier(_getEventsForDay(_selectedDay!));

    getCalendarEvents().then((value) {
      setState(() {
        events.addAll(value);
      });
    });
  }

  @override
  void dispose() {
    _selectedEvents.dispose();
    super.dispose();
  }

  Future<Map<DateTime, List<Event>>> getCalendarEvents() async {
    var map = new Map<DateTime, List<Event>>();
    await supabase
        .from(CalendarDayWithEvent().TABLENAME)
        .select("recipe_id, date")
        .match({'household_id': Service.user.household_id}).then((value) async {
      var recipeIds = [];
      for (var x = 0; x < value.length; x++) {
        recipeIds.add(value[x]['recipe_id']);
      }

      if (recipeIds.isEmpty) {
        return new Future.value(map[DateTime.now()] = []);
      }
      await supabase
          .from(RecipeTable().TABLENAME)
          .select("id, name")
          .in_("id", recipeIds)
          .onError((error, stackTrace) => print(error))
          .then((recipes) {
        for (var x = 0; x < value.length; x++) {
          recipes
              .where((element) => element['id'] == value[x]['recipe_id'])
              .forEach((element) {
            if (!map.containsKey(DateTime.parse(value[x]['date']))) {
              map[DateTime.parse(value[x]['date'])] = [];
            }

            map[DateTime.parse(value[x]['date'])]?.add(Event(element['name']));
          });
        }
      }).whenComplete(() {
        sleep(Duration(seconds: 1));
        events.addAll(map);
        return Future.value(map);
      }).onError((error2, stackTrace) {
        print(error2);
      });
    });

    return Future.value(map);
  }

  List<Event> _getEventsForDay(DateTime day) {
    return events[day] ?? [];
  }

  List<Event> _getEventsForRange(DateTime start, DateTime end) {
    // Implementation example
    final days = daysInRange(start, end);

    return [
      for (final d in days) ..._getEventsForDay(d),
    ];
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    if (!isSameDay(_selectedDay, selectedDay)) {
      setState(() {
        _selectedDay = selectedDay;
        _focusedDay = focusedDay;
        _rangeStart = null; // Important to clean those
        _rangeEnd = null;
        _rangeSelectionMode = RangeSelectionMode.toggledOff;
      });
      _selectedEvents.value = _getEventsForDay(selectedDay);
    }
    createPopUp();
  }

  void _onRangeSelected(DateTime? start, DateTime? end, DateTime focusedDay) {
    setState(() {
      _selectedDay = null;
      _focusedDay = focusedDay;
      _rangeStart = start;
      _rangeEnd = end;
      _rangeSelectionMode = RangeSelectionMode.toggledOn;
    });

    // `start` or `end` could be null
    if (start != null && end != null) {
      _selectedEvents.value = _getEventsForRange(start, end);
    } else if (start != null) {
      _selectedEvents.value = _getEventsForDay(start);
    } else if (end != null) {
      _selectedEvents.value = _getEventsForDay(end);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(children: [
        events.isNotEmpty
            ? TableCalendar<Event>(
                firstDay: kFirstDay,
                lastDay: kLastDay,
                focusedDay: _focusedDay,
                selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
                rangeStartDay: _rangeStart,
                rangeEndDay: _rangeEnd,
                calendarFormat: _calendarFormat,
                rangeSelectionMode: _rangeSelectionMode,
                eventLoader: _getEventsForDay,
                startingDayOfWeek: StartingDayOfWeek.monday,
                calendarStyle: CalendarStyle(
                    // Use `CalendarStyle` to customize the UI
                    outsideDaysVisible: false,
                    todayTextStyle: TextStyle(color: MyThemes.primaryColor),
                    todayDecoration: BoxDecoration(
                        color: MyThemes.secondaryColor, shape: BoxShape.circle),
                    selectedDecoration: BoxDecoration(
                        color: MyThemes.primaryColor, shape: BoxShape.circle)),
                onDaySelected: _onDaySelected,
                onRangeSelected: _onRangeSelected,
                onFormatChanged: (format) {
                  if (_calendarFormat != format) {
                    setState(() {
                      _calendarFormat = format;
                    });
                  }
                },
                onDayLongPressed: (selectedDay, focusedDay) => {
                  updateRecipes().then((value) {
                    this.recipes2 = new Future.value(value);
                    this.recipes = value;
                  }).whenComplete(
                    () => addRecipeToDay(selectedDay),
                  ),
                },
                calendarBuilders: CalendarBuilders(
                  singleMarkerBuilder: (context, date, _) {
                    return Container(
                      decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: MyThemes.primaryColor), //Change color
                      width: 5.0,
                      height: 5.0,
                      margin: const EdgeInsets.symmetric(horizontal: 1.5),
                    );
                  },
                ),
                onPageChanged: (focusedDay) {
                  _focusedDay = focusedDay;
                },
              )
            : Center(
                child: new Column(
                children: [MyThemes.ThemedCircularProgressIndicator],
              )),
        const SizedBox(height: 8.0),
        Expanded(
          child: ValueListenableBuilder<List<Event>>(
            valueListenable: _selectedEvents,
            builder: (context, value, _) {
              return ListView.builder(
                itemCount: value.length,
                itemBuilder: (context, index) {
                  return Container(
                      margin: const EdgeInsets.symmetric(
                        horizontal: 12.0,
                        vertical: 4.0,
                      ),
                      decoration: BoxDecoration(
                          border: Border.all(color: MyThemes.primaryColor),
                          borderRadius: BorderRadius.circular(12.0)),
                      child: ListTile(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) =>
                                    RecipePage("${value[index]}"),
                              ),
                            );
                          },
                          title: Text('${value[index]}'),
                          onLongPress: () {
                            var id;
                            var date;
                            createBasicAlertDialog(
                                    context, "Willst du das Event entfernen?")
                                .then((val) async {
                              if (val) {
                                var snackbar = showNotification(
                                    context, "Event wird entfernt");

                                deleteRecipeFromDay(
                                        _selectedDay!, value[index].title)
                                    .whenComplete(() {
                                  snackbar.close();
                                });
                              }
                            });
                          }));
                },
              );
            },
          ),
        ),
      ]),
    );
  }

  addRecipeToDay(DateTime date) {
    int? recipeId;
    String? recipeName;
    int? recipeNumberOfPeople;
    List<String> list = <String>['1', '2', '3', '4'];
    return showDialog<bool>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
          return AlertDialog(
            content: FutureBuilder<List<Recipe>>(
                future: recipes2,
                builder: (BuildContext context,
                    AsyncSnapshot<List<Recipe>> snapshot) {
                  List<Widget> children = <Widget>[];

                  for (var recipe in recipes) {
                    children.add(ListTile(
                      title: Text(recipe.name),
                      leading: Radio(
                        value: recipe.id,
                        groupValue: recipeId,
                        onChanged: (value) {
                          setState(() {
                            recipeId = value as int?;
                            recipeName = recipe.name;
                            recipeNumberOfPeople = recipe.number_of_people;
                          });
                        },
                      ),
                    ));
                  }
                  return Center(
                      child: SingleChildScrollView(
                    child: Column(children: [
                      ...children,
                    ]),
                  ));
                }),
            actions: <Widget>[
              Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text("Personen "),
                    DropdownButton<String>(
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
                    )
                  ]),
              Row(
                children: [
                  Column(
                    children: [
                      Wrap(
                        children: [
                          TextButton(
                            child: const Text('Zurück'),
                            onPressed: () {
                              Navigator.of(context).pop(false);
                            },
                          ),
                        ],
                      )
                    ],
                  ),
                  Spacer(),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                          child: Text('Rezept eintragen'),
                          onPressed: () {
                            submitRecipeToDay(date, recipeName!, recipeId!,
                                    recipeNumberOfPeople!, dropdownValue)
                                .whenComplete(
                                    () => Navigator.of(context).pop(true));
                          })
                    ],
                  )
                ],
              )
            ],
          );
        });
      },
    );
  }

  Future<void> submitRecipeToDay(DateTime dateTime, String recipe_name,
      int recipeId, int originalNumberOfPeople, String number_of_people) async {
    var date = DateFormat('yyyy-MM-dd').format(dateTime);

    var user = Service.user;

    await supabase.from(CalendarDayWithEvent().TABLENAME).insert({
      'recipe_id': recipeId,
      'date': date,
      'number_of_people': number_of_people,
      'household_id': user.household_id
    }).then((value) async {
      await supabase
          .from(RecipeItemTable().TABLENAME)
          .select('name,id')
          .match({'recipe_id': recipeId}).then((value) async {
        late int shopping_list_from_recipes_id;
        List<RecipeItem> list;
        await supabase
            .from(ShoppingListFromRecipes().TABLENAME)
            .insert({
              'recipe_name': recipe_name,
              'recipe_id': recipeId,
              'amount_of_people': number_of_people,
              'date': date,
              'household_id': Service.user.household_id
            })
            .select('id')
            .then((value) async {
              shopping_list_from_recipes_id = value[0]['id'];
              List<ShoppingListItemFromRecipe> list = [];
              Map<int, String> recipeItems2 = new Map();
              await supabase
                  .from(RecipeItemTable().TABLENAME)
                  .select('name,recipe_id,id')
                  .then((recipeItems) {
                for (var recipeItem in recipeItems) {
                  recipeItems2[recipeItem['id']] = recipeItem['name'];
                }
              }).whenComplete(() async {
                await supabase
                    .from(AmountTable().TABLENAME)
                    .select('amount,unit,recipe_item_id')
                    .match({'recipe_id': recipeId}).then((recipeAmounts) {
                  for (var x = 0; x < recipeAmounts.length; x++) {
                    list.add(new ShoppingListItemFromRecipe(
                        shopping_list_from_recipes_id,
                        recipeItems2[recipeAmounts[x]['recipe_item_id']]!,
                        recipeAmounts[x]['amount'] is int
                            ? (recipeAmounts[x]['amount'] as int).toDouble()
                            : recipeAmounts[x]['amount'],
                        recipeAmounts[x]['unit'],
                        date));
                  }
                }).whenComplete(() async {
                  var jsonArray = [];

                  for (var shoppingListItem in list) {
                    jsonArray.add({
                      'shopping_list_from_recipes_id':
                          shopping_list_from_recipes_id,
                      'name': shoppingListItem.name,
                      'amount': shoppingListItem.amount *
                          (int.parse(number_of_people) / originalNumberOfPeople)
                              .toDouble(),
                      'unit': shoppingListItem.unit,
                      'date': date,
                      'household_id': Service.user.household_id
                    });
                  }

                  await supabase
                      .from(ShoppingListItems().TABLENAME)
                      .insert(jsonArray);
                });
              });
            });
      });
      getCalendarEvents().then((events) => {
            setState(() {
              events.addAll(events);
              _selectedEvents.value = _getEventsForDay(_selectedDay!);
            }),
          });
    });
  }

  Future<void> deleteRecipeFromDay(
      DateTime dateTime, String recipe_name) async {
    int id;
    var date;
    await supabase
        .from(RecipeTable().TABLENAME)
        .select('id')
        .match({'name': recipe_name}).then((result) async {
      id = result[0]['id'];
      date = DateFormat('yyyy-MM-dd').format(_selectedDay!);

      await supabase.from(CalendarDayWithEvent().TABLENAME).delete().match({
        'recipe_id': id,
        'date': date,
      }).whenComplete(() async {
        await supabase
            .from(ShoppingListFromRecipes().TABLENAME)
            .select('id')
            .onError((error, stackTrace) => print("didnt work"))
            .then((shopping_list_from_recipe_id) async {
          print(shopping_list_from_recipe_id[0]['id']);

          try {
            await supabase.from(ShoppingListItems().TABLENAME).delete().match({
              'shopping_list_from_recipes_id': shopping_list_from_recipe_id[0]
                  ['id']
            }).whenComplete(() async {
              await supabase
                  .from(ShoppingListFromRecipes().TABLENAME)
                  .delete()
                  .match({'recipe_id': id, 'date': date}).whenComplete(() {
                setState(() {
                  events[_selectedDay]!.removeWhere((element) {
                    return element.title == recipe_name;
                  });
                });
              });
            });
          } catch (error) {
            print(error);
          }
        });
      });
    });
  }
}

class ShoppingListItemFromRecipe {
  int shopping_list_from_recipes_id;
  String name;
  double amount;
  String unit;
  String date;
  List<String>? recipe_name;
  List<int>? id;
  String? status; // RecipeAmount amount;
  ShoppingListItemFromRecipe(this.shopping_list_from_recipes_id, this.name,
      this.amount, this.unit, this.date,
      [this.id, this.status, this.recipe_name]);
}

class ShoppingListItemFromGeneral {
  int id;
  String name;
  String description;
  String status; // RecipeAmount amount;
  ShoppingListItemFromGeneral(
      this.id, this.name, this.description, this.status);
}
