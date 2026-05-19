import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';
import '../widgets/bilingual_text.dart';

class DisputeResolutionScreen extends StatelessWidget {
  const DisputeResolutionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);
    final dispute = bookingProvider.activeDispute;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
            children: [
              const SizedBox(height: 48),
              // Resolution Shield Anim
              const CircleAvatar(
                    radius: 40,
                    backgroundColor: AppColors.primarySurface,
                    child: Icon(
                      Icons.shield,
                      color: AppColors.success,
                      size: 50,
                    ),
                  )
                  .animate()
                  .scale(duration: 400.ms, curve: Curves.bounceOut)
                  .fadeIn(),
              const SizedBox(height: 16),
              const BilingualText(
                english: "Dispute Auto-Resolved",
                urdu: "تنازعہ خودکار طور پر حل ہو گیا",
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
              // Adjudicator Resolution Details
              if (dispute != null) ...[
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
                          english: "Resolution Summary",
                          urdu: "فیصلہ کا خلاصہ",
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
                          "Ticket ID / ٹکٹ نمبر",
                          dispute.disputeId,
                        ),
                        const SizedBox(height: 8),
                        _buildDetailRow(
                          "Booking ID / بکنگ نمبر",
                          dispute.bookingId,
                        ),
                        const SizedBox(height: 8),
                        _buildDetailRow(
                          "Complaint Category / کیٹیگری",
                          dispute.disputeType,
                        ),
                        const SizedBox(height: 8),
                        _buildDetailRow(
                          "Escalation / ترجیحی لیول",
                          "Level ${dispute.escalationLevel}",
                        ),
                        const Divider(height: 24, color: AppColors.divider),
                        const BilingualText(
                          english: "Outcome Decision:",
                          urdu: "فیصلہ کی تفصیل:",
                          englishStyle: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                          urduStyle: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          dispute.resolutionText,
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                // Compensations Wallet Alert Card
                Card(
                  elevation: 0,
                  color: AppColors.primarySurface,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.0),
                    side: const BorderSide(
                      color: AppColors.success,
                      width: 1.0,
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        const BilingualText(
                          english: "Compensation Refunded to Wallet",
                          urdu: "معاوضہ آپ کے والٹ میں منتقل ہو گیا ہے",
                          englishStyle: TextStyle(
                            color: AppColors.success,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                          urduStyle: TextStyle(
                            color: AppColors.success,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                          crossAxisAlignment: CrossAxisAlignment.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "PKR ${dispute.compensationAmount}",
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: AppColors.success,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 40),
              // Exit back home
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    bookingProvider.clearBooking();
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                  ),
                  child: const BilingualText(
                    english: "Return to Main Menu",
                    urdu: "مین مینو پر واپس جائیں",
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
              const SizedBox(height: 32),
            ],
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
