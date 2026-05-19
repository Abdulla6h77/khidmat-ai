import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';
import '../constants/app_text_styles.dart';
import '../providers/booking_provider.dart';
import '../widgets/bilingual_text.dart';
import '07_dispute_resolution_screen.dart';

class DisputeScreen extends StatefulWidget {
  const DisputeScreen({super.key});

  @override
  State<DisputeScreen> createState() => _DisputeScreenState();
}

class _DisputeScreenState extends State<DisputeScreen> {
  String _selectedIssueType = "Quality";
  final TextEditingController _detailsController = TextEditingController();

  final List<Map<String, String>> _issueTypes = [
    {"value": "Quality", "en": "Poor Workmanship / خراب کام", "ur": ""},
    {"value": "Delay", "en": "Late Arrival / تاخیر سے آنا", "ur": ""},
    {"value": "Pricing", "en": "Pricing Discrepancy / قیمت کا مسئلہ", "ur": ""},
    {"value": "Behavior", "en": "Unprofessional Conduct / بدتمیزی", "ur": ""},
  ];

  @override
  void dispose() {
    _detailsController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    final details = _detailsController.text.trim();
    if (details.isEmpty) return;

    final bookingProvider = Provider.of<BookingProvider>(
      context,
      listen: false,
    );

    bool success = await bookingProvider.submitDispute(
      _selectedIssueType,
      details,
    );

    if (success && mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => const DisputeResolutionScreen(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: BilingualText(
          english: AppStrings.disputeTitleEn,
          urdu: AppStrings.disputeTitleUr,
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
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
                      english: "Select Issue Category",
                      urdu: "مسئلہ کی قسم منتخب کریں",
                      englishStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                        fontSize: 14,
                      ),
                      urduStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      initialValue: _selectedIssueType,
                      decoration: InputDecoration(
                        fillColor: AppColors.background,
                        filled: true,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8.0),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                      ),
                      items: _issueTypes.map((type) {
                        return DropdownMenuItem<String>(
                          value: type['value'],
                          child: Text(
                            type['en']!,
                            style: const TextStyle(fontSize: 13),
                          ),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setState(() {
                            _selectedIssueType = val;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    const BilingualText(
                      english: "Write description / details",
                      urdu: "مسئلے کی تفصیل لکھیں",
                      englishStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                        fontSize: 14,
                      ),
                      urduStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _detailsController,
                      maxLines: 4,
                      style: const TextStyle(fontSize: 13),
                      decoration: InputDecoration(
                        hintText:
                            "Enter exact details about your complaint here...",
                        fillColor: AppColors.background,
                        filled: true,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8.0),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.all(12),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Raise Dispute Button
            Consumer<BookingProvider>(
              builder: (context, booking, child) {
                return SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: booking.isLoading
                        ? null
                        : () => _handleSubmit(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.error,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                    ),
                    child: booking.isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const BilingualText(
                            english: AppStrings.raiseDisputeEn,
                            urdu: AppStrings.raiseDisputeUr,
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
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
