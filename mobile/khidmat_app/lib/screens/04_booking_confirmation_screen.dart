import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';
import '../providers/booking_provider.dart';
import '../widgets/bilingual_text.dart';
import '05_tracking_screen.dart';

class BookingConfirmationScreen extends StatelessWidget {
  const BookingConfirmationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);
    final booking = bookingProvider.activeBooking;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              children: [
                const SizedBox(height: 48),
                // Success Badge Anim
                const CircleAvatar(
                      radius: 40,
                      backgroundColor: AppColors.primarySurface,
                      child: Icon(
                        Icons.check_circle,
                        color: AppColors.primary,
                        size: 50,
                      ),
                    )
                    .animate()
                    .scale(duration: 400.ms, curve: Curves.bounceOut)
                    .fadeIn(),
                const SizedBox(height: 16),
                const BilingualText(
                  english: AppStrings.bookingConfirmedEn,
                  urdu: AppStrings.bookingConfirmedUr,
                  englishStyle: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                  urduStyle: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                  crossAxisAlignment: CrossAxisAlignment.center,
                ),
                const SizedBox(height: 24),
                // Premium Detailed Summary Card
                if (booking != null) ...[
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
                            english: "Booking Summary",
                            urdu: "بکنگ کی تفصیلات",
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
                          const Divider(height: 24, color: AppColors.divider),
                          _buildDetailRow(
                            "Provider / فراہم کنندہ",
                            booking.providerName,
                          ),
                          const SizedBox(height: 8),
                          _buildDetailRow(
                            "Service / سروس",
                            booking.serviceType,
                          ),
                          const SizedBox(height: 8),
                          _buildDetailRow(
                            "Time Slot / وقت کا انتخاب",
                            booking.timeSlot,
                          ),
                          const SizedBox(height: 8),
                          _buildDetailRow(
                            "Dynamic Price / کل قیمت",
                            "PKR ${booking.price}",
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  // High-Visibility Amber Code Card
                  Card(
                    elevation: 0,
                    color: AppColors.accentSurface,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12.0),
                      side: const BorderSide(
                        color: AppColors.accent,
                        width: 1.5,
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          const BilingualText(
                            english:
                                "Job Completion Code (Do not share until complete)",
                            urdu:
                                "کام کی تکمیل کا کوڈ (مکمل ہونے تک شیئر نہ کریں)",
                            englishStyle: TextStyle(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                            urduStyle: TextStyle(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                            crossAxisAlignment: CrossAxisAlignment.center,
                          ),
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8.0),
                            ),
                            child: Text(
                              booking.code,
                              style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                                letterSpacing: 8.0,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 40),
                // Action Buttons
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const TrackingScreen(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                    child: const BilingualText(
                      english: AppStrings.trackServiceEn,
                      urdu: AppStrings.trackServiceUr,
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
                const SizedBox(height: 12),
                // Exit home option
                TextButton(
                  onPressed: () {
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                  child: const BilingualText(
                    english: "Back to Home / ہوم پیج پر واپس جائیں",
                    urdu: "",
                    englishStyle: TextStyle(
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.bold,
                    ),
                    urduStyle: TextStyle(),
                    crossAxisAlignment: CrossAxisAlignment.center,
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
        ),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
            fontSize: 13,
          ),
        ),
      ],
    );
  }
}
