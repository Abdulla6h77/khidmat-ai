import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTextStyles {
  static TextStyle get headingLargeEn => GoogleFonts.roboto(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );

  static TextStyle get headingLargeUr => const TextStyle(
    fontFamily: 'Noto Sans Arabic',
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: AppColors.textPrimary,
  );

  static TextStyle get headingMediumEn => GoogleFonts.roboto(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );

  static TextStyle get headingMediumUr => const TextStyle(
    fontFamily: 'Noto Sans Arabic',
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );

  static TextStyle get bodyEn =>
      GoogleFonts.roboto(fontSize: 14, color: AppColors.textSecondary);

  static TextStyle get bodyUr => const TextStyle(
    fontFamily: 'Noto Sans Arabic',
    fontSize: 13,
    color: AppColors.textSecondary,
  );

  static TextStyle get captionEn =>
      GoogleFonts.roboto(fontSize: 12, color: AppColors.textDisabled);

  static TextStyle get captionUr => const TextStyle(
    fontFamily: 'Noto Sans Arabic',
    fontSize: 11,
    color: AppColors.textDisabled,
  );
}
