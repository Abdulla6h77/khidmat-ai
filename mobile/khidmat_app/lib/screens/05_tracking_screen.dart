import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';
import '../constants/app_text_styles.dart';
import '../providers/booking_provider.dart';
import '../providers/trace_provider.dart';
import '../widgets/bilingual_text.dart';
import '../widgets/trace_sheet.dart';
import '06_dispute_screen.dart';
import '08_baseline_compare_screen.dart';

class TrackingScreen extends StatefulWidget {
  const TrackingScreen({super.key});

  @override
  State<TrackingScreen> createState() => _TrackingScreenState();
}

class _TrackingScreenState extends State<TrackingScreen> {
  // Stepper tracker items list mapping statuses
  final List<Map<String, String>> _statusSteps = [
    {
      "status": "confirmed",
      "en": "Booking Confirmed",
      "ur": "بکنگ کی تصدیق ہو گئی",
    },
    {"status": "en_route", "en": "Driver En-Route", "ur": "کارکن راستے میں ہے"},
    {
      "status": "arrived",
      "en": "Driver Arrived at Zone",
      "ur": "کارکن پہنچ چکا ہے",
    },
    {
      "status": "in_progress",
      "en": "Service In Progress",
      "ur": "کام شروع ہو گیا ہے",
    },
    {
      "status": "completed",
      "en": "Service Completed",
      "ur": "سروس مکمل ہو گئی",
    },
  ];

  void _showAgentTraceSheet(BuildContext context, String bookingId) async {
    final traceProvider = Provider.of<TraceProvider>(context, listen: false);
    await traceProvider.fetchAgentTrace(bookingId);

    if (!context.mounted) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => FractionallySizedBox(
        heightFactor: 0.8,
        child: Consumer<TraceProvider>(
          builder: (context, trace, child) {
            if (trace.isLoading) {
              return Container(
                color: Colors.white,
                child: const Center(child: CircularProgressIndicator()),
              );
            }
            return TraceSheet(
              traces: trace.traces,
              processingTime: trace.processingTime,
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);
    final booking = bookingProvider.activeBooking;

    if (booking == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text("Tracking"),
          backgroundColor: AppColors.primary,
        ),
        body: const Center(
          child: BilingualText(
            english: "No active tracking booking session found.",
            urdu: "کوئی فعال بکنگ سیشن نہیں ملا۔",
            crossAxisAlignment: CrossAxisAlignment.center,
          ),
        ),
      );
    }

    final currentStatusIndex = _statusSteps.indexWhere(
      (step) => step['status'] == booking.status,
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: BilingualText(
          english: AppStrings.trackServiceEn,
          urdu: AppStrings.trackServiceUr,
          englishStyle: AppTextStyles.headingMediumEn.copyWith(
            color: Colors.white,
          ),
          urduStyle: AppTextStyles.headingMediumUr.copyWith(
            color: Colors.white,
          ),
        ),
        backgroundColor: AppColors.primary,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Column(
          children: [
            // Status and ETA card
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
                side: const BorderSide(color: AppColors.divider),
              ),
              color: AppColors.surface,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const BilingualText(
                          english: "Current Status",
                          urdu: "موجودہ صورتحال",
                          englishStyle: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                          urduStyle: TextStyle(
                            fontSize: 11,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: booking.status == 'completed'
                                ? AppColors.success.withValues(alpha: 0.1)
                                : AppColors.primarySurface,
                            borderRadius: BorderRadius.circular(4.0),
                          ),
                          child: Text(
                            booking.status.toUpperCase().replaceAll('_', ' '),
                            style: TextStyle(
                              color: booking.status == 'completed'
                                  ? AppColors.success
                                  : AppColors.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const BilingualText(
                          english: "Estimated Arrival",
                          urdu: "آمد کا متوقع وقت",
                          englishStyle: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                          urduStyle: TextStyle(
                            fontSize: 11,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          booking.eta,
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Tracking Stepper Timeline
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
                side: const BorderSide(color: AppColors.divider),
              ),
              color: AppColors.surface,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const BilingualText(
                      english: "Service Progress Timeline",
                      urdu: "سروس کی پیش رفت کا ریکارڈ",
                      englishStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                        fontSize: 15,
                      ),
                      urduStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Timeline steps loop
                    ...List.generate(_statusSteps.length, (index) {
                      final step = _statusSteps[index];
                      final isLast = index == _statusSteps.length - 1;
                      final isDone = index <= currentStatusIndex;
                      final isCurrent = index == currentStatusIndex;

                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Graphic stepper connector line
                          Column(
                            children: [
                              Container(
                                width: 20,
                                height: 20,
                                decoration: BoxDecoration(
                                  color: isDone
                                      ? AppColors.primary
                                      : Colors.transparent,
                                  border: Border.all(
                                    color: isDone
                                        ? AppColors.primary
                                        : AppColors.textDisabled,
                                    width: 2.0,
                                  ),
                                  shape: BoxShape.circle,
                                ),
                                child: isDone
                                    ? const Icon(
                                        Icons.check,
                                        size: 12,
                                        color: Colors.white,
                                      )
                                    : null,
                              ),
                              if (!isLast)
                                Container(
                                  width: 2,
                                  height: 40,
                                  color: isDone && (index < currentStatusIndex)
                                      ? AppColors.primary
                                      : AppColors.divider,
                                ),
                            ],
                          ),
                          const SizedBox(width: 16),
                          // Content Text
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(top: 2.0),
                              child: BilingualText(
                                english: step['en']!,
                                urdu: step['ur']!,
                                englishStyle: TextStyle(
                                  fontSize: 13,
                                  fontWeight: isCurrent
                                      ? FontWeight.bold
                                      : isDone
                                      ? FontWeight.w500
                                      : FontWeight.normal,
                                  color: isCurrent
                                      ? AppColors.primary
                                      : isDone
                                      ? AppColors.textPrimary
                                      : AppColors.textDisabled,
                                ),
                                urduStyle: TextStyle(
                                  fontSize: 12,
                                  fontWeight: isCurrent
                                      ? FontWeight.bold
                                      : isDone
                                      ? FontWeight.w500
                                      : FontWeight.normal,
                                  color: isCurrent
                                      ? AppColors.primary
                                      : isDone
                                      ? AppColors.textPrimary
                                      : AppColors.textDisabled,
                                ),
                              ),
                            ),
                          ),
                        ],
                      );
                    }),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            // "Agent Trace" transparency button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () =>
                    _showAgentTraceSheet(context, booking.bookingId),
                icon: const Icon(Icons.history_edu, color: Colors.white),
                label: const BilingualText(
                  english: "Agent Decision Trace",
                  urdu: "ایجنٹ ٹریس لاگز دیکھیں",
                  englishStyle: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                  urduStyle: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                  crossAxisAlignment: CrossAxisAlignment.center,
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            // Advance Driver Status Debugging button
            if (booking.status != 'completed') ...[
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: bookingProvider.isLoading
                      ? null
                      : () => bookingProvider.simulateStatusProgression(),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.primary),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                  ),
                  child: bookingProvider.isLoading
                      ? const SizedBox(
                          height: 16,
                          width: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const BilingualText(
                          english: "Simulate Driver Step / اگلی اسٹیٹس بڑھائیں",
                          urdu: "",
                          englishStyle: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                          urduStyle: TextStyle(),
                          crossAxisAlignment: CrossAxisAlignment.center,
                        ),
                ),
              ),
              const SizedBox(height: 12),
            ],
            // Redirect button: If complete, see baseline performance; else raise dispute
            if (booking.status == 'completed') ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const BaselineCompareScreen(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.success,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                  ),
                  child: const BilingualText(
                    english: "View Performance Analytics",
                    urdu: "بکنگ کی کارکردگی کا موازنہ",
                    englishStyle: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                    urduStyle: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                    crossAxisAlignment: CrossAxisAlignment.center,
                  ),
                ),
              ),
            ] else ...[
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const DisputeScreen(),
                      ),
                    );
                  },
                  child: const BilingualText(
                    english: "Report Issue / Issue Report Karen",
                    urdu: "مسئلہ رپورٹ کریں / تنازعہ درج کریں",
                    englishStyle: TextStyle(
                      color: AppColors.error,
                      fontWeight: FontWeight.bold,
                    ),
                    urduStyle: TextStyle(
                      color: AppColors.error,
                      fontWeight: FontWeight.bold,
                    ),
                    crossAxisAlignment: CrossAxisAlignment.center,
                  ),
                ),
              ),
            ],
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
