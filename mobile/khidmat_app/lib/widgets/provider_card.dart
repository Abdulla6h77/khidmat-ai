import 'package:flutter/material.dart';
import '../models/provider_model.dart';
import '../constants/app_colors.dart';
import '../constants/app_text_styles.dart';
import 'bilingual_text.dart';

class ProviderCard extends StatelessWidget {
  final ProviderModel provider;
  final VoidCallback onTap;

  const ProviderCard({super.key, required this.provider, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
        side: const BorderSide(color: AppColors.divider, width: 1.0),
      ),
      color: AppColors.surface,
      margin: const EdgeInsets.only(bottom: 12.0),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12.0),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Row
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Provider Avatar Circle
                  CircleAvatar(
                    radius: 24,
                    backgroundColor: AppColors.primarySurface,
                    child: Text(
                      provider.name.isNotEmpty ? provider.name[0] : 'P',
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Name and services
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        BilingualText(
                          english: provider.name,
                          urdu: provider
                              .name, // Usually the same, but Urdu characters can be used
                          englishStyle: AppTextStyles.headingMediumEn,
                          urduStyle: AppTextStyles.headingMediumUr,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          provider.serviceTypes.join(" • "),
                          style: AppTextStyles.captionEn,
                        ),
                      ],
                    ),
                  ),
                  // Rating and Pricing
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.star,
                            color: AppColors.accent,
                            size: 18,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            provider.rating.toStringAsFixed(1),
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        "PKR ${provider.baseRatePerHour}/hr",
                        style: const TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const Divider(height: 24, color: AppColors.divider),
              // Status badges row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Info items
                  Row(
                    children: [
                      _buildChip(
                        "${(provider.onTimeScore * 100).toInt()}% On-Time",
                        "${(provider.onTimeScore * 100).toInt()}% وقت پر",
                        AppColors.success.withOpacity(0.1),
                        AppColors.success,
                      ),
                      const SizedBox(width: 8),
                      _buildChip(
                        "${provider.distanceKm} km",
                        "${provider.distanceKm} کلومیٹر",
                        AppColors.warning.withOpacity(0.1),
                        AppColors.warning,
                      ),
                    ],
                  ),
                  // Action text with Careem green color
                  Row(
                    children: [
                      BilingualText(
                        english: "Details",
                        urdu: "تفصیلات",
                        englishStyle: AppTextStyles.captionEn.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                        urduStyle: AppTextStyles.captionUr.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(
                        Icons.arrow_forward_ios,
                        size: 12,
                        color: AppColors.primary,
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChip(String en, String ur, Color bg, Color text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(4.0),
      ),
      child: BilingualText(
        english: en,
        urdu: ur,
        englishStyle: TextStyle(
          color: text,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
        urduStyle: TextStyle(
          color: text,
          fontSize: 9,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
