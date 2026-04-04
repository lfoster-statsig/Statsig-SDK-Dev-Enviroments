// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:my_new_app/main.dart';
import 'package:statsig/statsig.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    await Statsig.initialize('secret-nVM4EfPnhlwhmQX3x5xYLFnmAzyoopd0iSDBPRrNVUl', StatsigUser(userId: "loganfoster"));

    // Verify that our counter starts at 0.
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing); 

    result = Statsig.checkGate("test_gate");
    print("Is user in experiment?", result);

    updateUser = await Statsig.updateUser(StatsigUser(userId: "loganfoster", custom: {"is_test_user": true}));
    result = Statsig.checkGate("test_gate");

    // Tap the '+' icon and trigger a frame.
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    // Verify that our counter has incremented.
    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
