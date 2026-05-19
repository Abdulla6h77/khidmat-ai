import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';
import '../constants/app_text_styles.dart';
import '../providers/request_provider.dart';
import '../providers/booking_provider.dart';
import '../widgets/bilingual_text.dart';
import '../widgets/provider_card.dart';
import '../widgets/skeleton_loader.dart';
import '03_provider_detail_screen.dart';

class ProvidersScreen extends StatelessWidget {
  const ProvidersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final requestProvider = Provider.of<RequestProvider>(context);
    final intent = requestProvider.intent;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: BilingualText(
          english: AppStrings.providersTitleEn,
          urdu: AppStrings.providersTitleUr,
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
      body: Column(
        children: [
          // Intent Parsing Summary Header
          if (intent != null)
            Container(
              decoration: const BoxDecoration(
                color: AppColors.surface,
                border: Border(
                  bottom: BorderSide(color: AppColors.divider),
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  const Icon(
                    Icons.psychology_outlined,
                    color: AppColors.primary,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        BilingualText(
                          english:
                              "AI parsed: ${intent.detectedCategory} at ${intent.detectedArea}",
                          urdu:
                              "اے آئی نتیجہ: ${intent.detectedCategory} مقام ${intent.detectedArea}",
                          englishStyle: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: AppColors.textPrimary,
                          ),
                          urduStyle: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        if (intent.slotNote.isNotEmpty) ...[
                          const SizedBox(height: 2),
                          Text(
                            intent.slotNote,
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppColors.warning,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  // Confidence Badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.accentSurface,
                      borderRadius: BorderRadius.circular(4.0),
                      border: Border.all(color: AppColors.accent),
                    ),
                    child: Text(
                      "${(intent.confidenceScore * 100).toInt()}% Conf",
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          // Providers List Content
          Expanded(
            child: Consumer<BookingProvider>(
              builder: (context, booking, child) {
                if (booking.isLoading) {
                  return ListView.builder(
                    itemCount: 3,
                    padding: const EdgeInsets.all(16.0),
                    itemBuilder: (context, index) => const Padding(
                      padding: EdgeInsets.only(bottom: 12.0),
                      child: SkeletonLoader(
                        width: double.infinity,
                        height: 140,
                        borderRadius: 12,
                      ),
                    ),
                  );
                }

                if (booking.errorMessage != null) {
                  return Center(
                    child: BilingualText(
                      english: booking.errorMessage!,
                      urdu: "فہرست لوڈ کرنے میں خرابی پیش آئی۔",
                      englishStyle: const TextStyle(color: AppColors.error),
                      urduStyle: const TextStyle(color: AppColors.error),
                      crossAxisAlignment: CrossAxisAlignment.center,
                    ),
                  );
                }

                if (booking.providers.isEmpty) {
                  return const Center(
                    child: BilingualText(
                      english: "No service providers active near this area.",
                      urdu: "اس علاقے میں کوئی فراہم کنندہ دستیاب نہیں ہے۔",
                      crossAxisAlignment: CrossAxisAlignment.center,
                    ),
                  );
                }

                return ListView.builder(
                  itemCount: booking.providers.length,
                  padding: const EdgeInsets.all(16.0),
                  itemBuilder: (context, index) {
                    final provider = booking.providers[index];
                    return ProviderCard(
                      provider: provider,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                ProviderDetailScreen(provider: provider),
                          ),
                        );
                      },
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
