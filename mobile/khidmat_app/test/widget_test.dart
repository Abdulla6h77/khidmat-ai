// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:khidmat_app/main.dart';
import 'package:khidmat_app/providers/request_provider.dart';
import 'package:khidmat_app/providers/booking_provider.dart';
import 'package:khidmat_app/providers/trace_provider.dart';

void main() {
  testWidgets('KhidmatAI smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => RequestProvider()),
          ChangeNotifierProvider(create: (_) => BookingProvider()),
          ChangeNotifierProvider(create: (_) => TraceProvider()),
        ],
        child: const KhidmatApp(),
      ),
    );

    // Verify some home title or hint is present on the main screen.
    expect(find.text('KhidmatAI'), findsWidgets);

    // Settle animations
    await tester.pumpAndSettle();
  });
}
