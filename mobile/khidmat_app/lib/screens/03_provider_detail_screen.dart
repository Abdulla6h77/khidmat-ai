import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/provider_model.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';
import '../constants/app_text_styles.dart';
import '../providers/booking_provider.dart';
import '../widgets/bilingual_text.dart';
import '04_booking_confirmation_screen.dart';

class ProviderDetailScreen extends StatefulWidget {
  final ProviderModel provider;

  const ProviderDetailScreen({super.key, required this.provider});

  @override
  State<ProviderDetailScreen> createState() => _ProviderDetailScreenState();
}

class _ProviderDetailScreenState extends State<ProviderDetailScreen> {
  String? _selectedSlot;

  @override
  void initState() {
    super.initState();
    if (widget.provider.availabilitySlots.isNotEmpty) {
      _selectedSlot = widget.provider.availabilitySlots[0];
    }
  }

  // Calculate pricing breakdown modeled on 1.5km adjustments
  int get _baseRate => widget.provider.baseRatePerHour;
  int get _distanceAdjust => (widget.provider.distanceKm * 200)
      .toInt(); // PKR 200 per km travel overhead
  int get _totalPrice => _baseRate + _distanceAdjust;

  Future<void> _handleBooking() async {
    if (_selectedSlot == null) return;

    final bookingProvider = Provider.of<BookingProvider>(
      context,
      listen: false,
    );

    bool success = await bookingProvider.createBooking(
      providerId: widget.provider.id,
      providerName: widget.provider.name,
      serviceType: widget.provider.serviceTypes.join(" & "),
      timeSlot: _selectedSlot!,
      price: _totalPrice,
    );

    if (success && mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const BookingConfirmationScreen(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.provider;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: BilingualText(
          english: "Provider Details",
          urdu: "تفصیلات فراہم کنندہ",
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
        child: Column(
          children: [
            // Core Provider Header Card
            Container(
              color: AppColors.surface,
              width: double.infinity,
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: AppColors.primarySurface,
                    child: Text(
                      p.name.isNotEmpty ? p.name[0] : 'P',
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  BilingualText(
                    english: p.name,
                    urdu: p.name,
                    englishStyle: AppTextStyles.headingLargeEn,
                    urduStyle: AppTextStyles.headingLargeUr,
                    crossAxisAlignment: CrossAxisAlignment.center,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    p.serviceTypes.join(" • "),
                    style: AppTextStyles.captionEn.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.star, color: AppColors.accent, size: 20),
                      const SizedBox(width: 4),
                      Text(
                        "${p.rating} (${p.reviewCount} reviews)",
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Dynamic Pricing Breakdown
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Card(
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
                        english: "Price Breakdown (Dynamic Adjustment)",
                        urdu: "قیمت کی تفصیل (ڈائنامک ایڈجسٹمنٹ)",
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
                      _buildPriceRow(
                        "Base Rate / بنیادی قیمت",
                        "PKR $_baseRate",
                      ),
                      const SizedBox(height: 8),
                      _buildPriceRow(
                        "Travel Fee (${p.distanceKm} km) / سفری فیس",
                        "PKR $_distanceAdjust",
                      ),
                      const Divider(height: 24, color: AppColors.divider),
                      _buildPriceRow(
                        "Total Price / کل قیمت",
                        "PKR $_totalPrice",
                        isTotal: true,
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.primarySurface,
                          borderRadius: BorderRadius.circular(4.0),
                        ),
                        child: const BilingualText(
                          english:
                              "*Travel fee adjusted based on F-8 geo-fence distances to protect provider commutes.",
                          urdu:
                              "*فراہم کنندگان کی آمد و رفت کو آسان بنانے کے لیے سفری فیس علاقے کے فاصلے کے حساب سے مقرر کی گئی ہے۔",
                          englishStyle: TextStyle(
                            color: AppColors.primary,
                            fontSize: 10,
                          ),
                          urduStyle: TextStyle(
                            color: AppColors.primary,
                            fontSize: 9,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Slot Selection
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Card(
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
                        english: "Available Slots",
                        urdu: "دستیاب اوقات",
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
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8.0,
                        children: p.availabilitySlots.map((slot) {
                          final isSelected = _selectedSlot == slot;
                          return ChoiceChip(
                            label: Text(slot),
                            selected: isSelected,
                            onSelected: (selected) {
                              setState(() {
                                _selectedSlot = selected ? slot : null;
                              });
                            },
                            selectedColor: AppColors.primary,
                            labelStyle: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Primary Action Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Consumer<BookingProvider>(
                builder: (context, booking, child) {
                  return SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _selectedSlot == null || booking.isLoading
                          ? null
                          : () => _handleBooking(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
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
                              english: AppStrings.bookNowEn,
                              urdu: AppStrings.bookNowUr,
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
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceRow(String label, String value, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            color: AppColors.textPrimary,
            fontSize: isTotal ? 14 : 12,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            color: isTotal ? AppColors.primary : AppColors.textPrimary,
            fontSize: isTotal ? 16 : 12,
          ),
        ),
      ],
    );
  }
}
