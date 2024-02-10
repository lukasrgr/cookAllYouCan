import 'package:cook_all_you_can/index/pages/shared/shared.dart';
import 'package:flutter/material.dart';

enum MyThemeKeys { LIGHT, DARK }

class MyThemes {
  static var primaryColor = MyThemes.defaultPrimaryColor;
  static final defaultPrimaryColor = Color.fromRGBO(129, 199, 132, 1);
  static var secondaryColor = MyThemes.defaultSecondaryColor;
  static final defaultSecondaryColor = Colors.black;

  static final canvasBackgroundColor = Colors.grey[850];
  static final textColor = Colors.white;

  static var customTheme = MyThemes.darkTheme;
  static final ThemeData darkTheme = ThemeData(
    appBarTheme: AppBarTheme(backgroundColor: MyThemes.canvasBackgroundColor),
    textTheme: TextTheme(
        // Used in material 3 for input color
        bodyLarge: TextStyle(color: textColor)),
    //
    bottomNavigationBarTheme: BottomNavigationBarThemeData(
      elevation: 10,
    ),
    //
    listTileTheme: ListTileThemeData(
        textColor: Colors.white,
        iconColor: Colors.white,
        tileColor: canvasBackgroundColor?.withOpacity(0.9)),
    //
    scaffoldBackgroundColor: canvasBackgroundColor,
    brightness: Brightness.dark,
    canvasColor: canvasBackgroundColor,
    //
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: primaryColor,
      secondary: primaryColor.withOpacity(0.5),
      // secondary: const Colors.yellow.shade700,
      brightness: Brightness.dark,
    ),
    //
    cardColor: canvasBackgroundColor,
    cardTheme: CardTheme(
        color: canvasBackgroundColor,
        shadowColor: primaryColor,
        clipBehavior: Clip.hardEdge,
        elevation: 10.0,
        shape: RoundedRectangleBorder()),
    //
    checkboxTheme: CheckboxThemeData(side: BorderSide(color: primaryColor)),
    //
    inputDecorationTheme: InputDecorationTheme(
      iconColor: Colors.white,
      counterStyle: TextStyle(color: primaryColor),
      helperStyle: TextStyle(color: Colors.white),
      isDense: true,
      border: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.white, width: 0.0)),
    ),
    //
    dataTableTheme: DataTableThemeData(
      dataTextStyle: TextStyle(color: primaryColor),
    ),
    //
    iconButtonTheme: IconButtonThemeData(
        style: ButtonStyle(
      iconColor: MaterialStateColor.resolveWith((states) => Colors.white),
    )),
    //
    iconTheme: IconThemeData(color: Colors.white),
    primarySwatch: kToDark,
    //
    searchBarTheme: SearchBarThemeData(
      surfaceTintColor: MaterialStateColor.resolveWith(
          (states) => MyThemes.canvasBackgroundColor!.withOpacity(0.5)),
      // overlayColor: MaterialStateColor.resolveWith(
      //     (states) => MyThemes.canvasBackgroundColor!),
      backgroundColor: MaterialStateColor.resolveWith(
          (states) => MyThemes.canvasBackgroundColor!.withOpacity(0.5)),
      textStyle: MaterialStateProperty.resolveWith(
          (states) => TextStyle(color: Colors.white)),

      // textStyle: MaterialStateProperty.resolveWith(
      //     (states) => TextStyle(color: Colors.green)) //
    ),
    //
    datePickerTheme: DatePickerThemeData(backgroundColor: Colors.yellow),
    dropdownMenuTheme:
        DropdownMenuThemeData(textStyle: TextStyle(color: Colors.white)),
    //
    // textButtonTheme: TextButtonThemeData(
    //     style: ButtonStyle(
    //   backgroundColor:
    //       MaterialStateProperty.resolveWith((states) => Colors.white),
    // ))
  );

  static final ThemeData lightTheme = ThemeData(
    primaryColor: Colors.grey,
    brightness: Brightness.dark,
    highlightColor: Colors.white,
    backgroundColor: Colors.black54,
    textSelectionTheme: TextSelectionThemeData(selectionColor: Colors.grey),
  );

  static getThemeData(Color primary, Color primaryContrast) {
    MyThemes.primaryColor = primary;
    MyThemes.secondaryColor = primaryContrast;
    return ThemeData(
        colorScheme: ColorScheme.fromSwatch().copyWith(
          primary: primary,
          secondary: primary.withOpacity(0.5),
          // secondary: const Colors.yellow.shade700,
          brightness: Brightness.dark,
        ),
        dataTableTheme: DataTableThemeData(
          dataTextStyle: TextStyle(color: primary),
        ),
        primarySwatch: kToDark);
  }

  static var ThemedCircularProgressIndicator = Padding(
      padding: EdgeInsets.symmetric(vertical: 20),
      child: CircularProgressIndicator(color: MyThemes.primaryColor));

  static HistoryConfig history = new HistoryConfig(
      Colors.white, primaryColor.withOpacity(1), Colors.grey[850]!);

  static CalendarConfig calendar = new CalendarConfig(Colors.black);

  static final roundedRectangleBorder = RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.elliptical(10, 10)));
  static final noBorder = RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.elliptical(0, 0)));

  static final ThemedInputDecoration = (String labelText, String hintText) =>
      InputDecoration(
          fillColor: MyThemes.primaryColor,
          hoverColor: MyThemes.primaryColor,
          focusColor: MyThemes.primaryColor,
          enabledBorder: OutlineInputBorder(
              borderSide:
                  BorderSide(color: MyThemes.primaryColor.withOpacity(0.5))),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(width: 3, color: MyThemes.primaryColor),
          ),
          border:
              OutlineInputBorder(borderSide: BorderSide(color: Colors.green)),
          labelText: labelText,
          labelStyle: TextStyle(color: MyThemes.primaryColor),
          hintText: hintText);
}

class HistoryConfig {
  final Color textColor;
  final Color barColor;
  final Color chartBackgroundColor;

  HistoryConfig(this.textColor, this.barColor, this.chartBackgroundColor) {}
}

class CalendarConfig {
  final Color textColor;

  CalendarConfig(this.textColor) {}
}
