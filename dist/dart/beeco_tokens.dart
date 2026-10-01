// beeco design system 1.22.0 – GENERÁLT FÁJL, ne szerkeszd kézzel. Forrás: tokens/*.json, eszköz: tools/tokens-build.js
// Bence: ez a fájl a beeco-design-system dist/dart mappájából jön – ne szerkeszd kézzel.
import 'package:flutter/material.dart';

/// Primitívek – a felületen a szerepeket (BeecoRoles) használd.
abstract final class BeecoPalette {
  static const honey = Color(0xFFFECF39);
  static const honeyDeep = Color(0xFFD8A500);
  static const butter = Color(0xFFFEEEBB);
  static const cream = Color(0xFFFFF8E7);
  static const paper = Color(0xFFFFFDF6);
  static const white = Color(0xFFFFFFFF);
  static const olive = Color(0xFF2F371E);
  static const oliveStrong = Color(0xFF48542D);
  static const oliveSoft = Color(0xFF596B39);
  static const forest = Color(0xFF3D4E27);
  static const leaf = Color(0xFF6E8947);
  static const lime = Color(0xFFCDEC82);
  static const sage = Color(0xFFD3DDBB);
  static const sageBg = Color(0xFFE3ECCD);
  static const sprout = Color(0xFFF0F3EC);
  static const blossom = Color(0xFFF5B4C7);
  static const blossomBg = Color(0xFFFDE2E8);
  static const berry = Color(0xFF7A2E3F);
  static const red = Color(0xFFDB3A34);
  static const crimson = Color(0xFFB3261E);
  static const blush = Color(0xFFFDEEE6);
  static const ember = Color(0xFFEA580C);
  static const rust = Color(0xFF824217);
  static const sky = Color(0xFFB1DEFF);
  static const skyBg = Color(0xFFD6E8F7);
  static const ice = Color(0xFFD3ECFF);
  static const water = Color(0xFF0083E4);
  static const navy = Color(0xFF003E74);
  static const focus = Color(0xFF2656D9);
  static const black = Color(0xFF000000);
  static const coal = Color(0xFF1E1E1E);
  static const graphite = Color(0xFF505050);
  static const slate = Color(0xFF676767);
  static const silver = Color(0xFFC6C6C6);
  static const mist = Color(0xFFE6E6E6);
  static const night = Color(0xFF1F2615);
  static const nightSurface = Color(0xFF353F25);
  static const nightLine = Color(0xFFB6C4A3);
}

/// Termékbőr szín-szerepei (világos / sötét).
class BeecoRoles {
  const BeecoRoles({required this.bg, required this.surface, required this.surface2, required this.surfaceAccent, required this.ink, required this.inkSoft, required this.inkMuted, required this.line, required this.lineSoft, required this.accent, required this.accentPress, required this.onAccent, required this.shadow, required this.focus, required this.success, required this.successBg, required this.successInk, required this.danger, required this.dangerBg, required this.dangerInk, required this.warning, required this.warningBg, required this.warningInk, required this.info, required this.infoBg, required this.infoInk, required this.highlight, required this.scrim});
  final Color bg;
  final Color surface;
  final Color surface2;
  final Color surfaceAccent;
  final Color ink;
  final Color inkSoft;
  final Color inkMuted;
  final Color line;
  final Color lineSoft;
  final Color accent;
  final Color accentPress;
  final Color onAccent;
  final Color shadow;
  final Color focus;
  final Color success;
  final Color successBg;
  final Color successInk;
  final Color danger;
  final Color dangerBg;
  final Color dangerInk;
  final Color warning;
  final Color warningBg;
  final Color warningInk;
  final Color info;
  final Color infoBg;
  final Color infoInk;
  final Color highlight;
  final Color scrim;
  static const light = BeecoRoles(
    bg: BeecoPalette.cream,
    surface: BeecoPalette.white,
    surface2: BeecoPalette.sprout,
    surfaceAccent: BeecoPalette.butter,
    ink: BeecoPalette.black,
    inkSoft: BeecoPalette.graphite,
    inkMuted: BeecoPalette.slate,
    line: BeecoPalette.black,
    lineSoft: BeecoPalette.silver,
    accent: BeecoPalette.honey,
    accentPress: BeecoPalette.honeyDeep,
    onAccent: BeecoPalette.black,
    shadow: BeecoPalette.black,
    focus: BeecoPalette.focus,
    success: BeecoPalette.leaf,
    successBg: BeecoPalette.sageBg,
    successInk: BeecoPalette.forest,
    danger: BeecoPalette.red,
    dangerBg: BeecoPalette.blush,
    dangerInk: BeecoPalette.crimson,
    warning: BeecoPalette.ember,
    warningBg: BeecoPalette.butter,
    warningInk: BeecoPalette.rust,
    info: BeecoPalette.water,
    infoBg: BeecoPalette.ice,
    infoInk: BeecoPalette.navy,
    highlight: BeecoPalette.blossom,
    scrim: BeecoPalette.black,
  );
  static const dark = BeecoRoles(
    bg: BeecoPalette.night,
    surface: BeecoPalette.nightSurface,
    surface2: BeecoPalette.olive,
    surfaceAccent: BeecoPalette.oliveStrong,
    ink: BeecoPalette.cream,
    inkSoft: BeecoPalette.sage,
    inkMuted: BeecoPalette.nightLine,
    line: BeecoPalette.nightLine,
    lineSoft: BeecoPalette.oliveSoft,
    accent: BeecoPalette.honey,
    accentPress: BeecoPalette.honeyDeep,
    onAccent: BeecoPalette.black,
    shadow: BeecoPalette.black,
    focus: BeecoPalette.sky,
    success: BeecoPalette.lime,
    successBg: BeecoPalette.forest,
    successInk: BeecoPalette.lime,
    danger: BeecoPalette.red,
    dangerBg: BeecoPalette.berry,
    dangerInk: BeecoPalette.blossomBg,
    warning: BeecoPalette.ember,
    warningBg: BeecoPalette.rust,
    warningInk: BeecoPalette.butter,
    info: BeecoPalette.sky,
    infoBg: BeecoPalette.navy,
    infoInk: BeecoPalette.ice,
    highlight: BeecoPalette.blossom,
    scrim: BeecoPalette.black,
  );
}

abstract final class BeecoTokens {
  static const fontDisplay = 'Lalezar';
  static const fontBody = 'OpenSans';
  static const fsXs = 12.0;
  static const fsS = 14.0;
  static const fsM = 16.0;
  static const fsL = 20.0;
  static const fsXl = 26.0;
  static const fsn2xl = 34.0;
  static const fsn3xl = 46.0;
  static const sp1 = 4.0;
  static const sp2 = 8.0;
  static const sp3 = 12.0;
  static const sp4 = 16.0;
  static const sp5 = 24.0;
  static const sp6 = 32.0;
  static const sp7 = 48.0;
  static const sp8 = 64.0;
  static const rXs = 2.0;
  static const rS = 4.0;
  static const rM = 8.0;
  static const rL = 12.0;
  static const rPill = 999.0;
  static const bwHair = 1.0;
  static const bwBase = 2.0;
  static const shadowS = Offset(2, 2);
  static const shadowM = Offset(4, 4);
  static const shadowL = Offset(6, 6);
  static const tFast = Duration(milliseconds: 120);
  static const tBase = Duration(milliseconds: 200);
  static const tSlow = Duration(milliseconds: 400);
  static const tPress = Duration(milliseconds: 120);
  static const easeOut = Cubic(.23, 1, .32, 1);
  static const tap = 44.0;
}
