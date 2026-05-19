import 'package:flutter/material.dart';
import '../constants/app_text_styles.dart';

class BilingualText extends StatelessWidget {
  final String english;
  final String urdu;
  final TextStyle? englishStyle;
  final TextStyle? urduStyle;
  final CrossAxisAlignment crossAxisAlignment;
  final double spacing;

  const BilingualText({
    super.key,
    required this.english,
    required this.urdu,
    this.englishStyle,
    this.urduStyle,
    this.crossAxisAlignment = CrossAxisAlignment.start,
    this.spacing = 3.0,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: crossAxisAlignment,
      children: [
        // English (LTR)
        Text(
          english,
          style: englishStyle ?? AppTextStyles.bodyEn,
          textAlign: crossAxisAlignment == CrossAxisAlignment.center
              ? TextAlign.center
              : crossAxisAlignment == CrossAxisAlignment.end
              ? TextAlign.right
              : TextAlign.left,
        ),
        SizedBox(height: spacing),
        // Urdu (RTL)
        Directionality(
          textDirection: TextDirection.rtl,
          child: Text(
            urdu,
            style: urduStyle ?? AppTextStyles.bodyUr,
            textAlign: crossAxisAlignment == CrossAxisAlignment.center
                ? TextAlign.center
                : crossAxisAlignment == CrossAxisAlignment.start
                ? TextAlign.right
                : TextAlign.left,
          ),
        ),
      ],
    );
  }
}
