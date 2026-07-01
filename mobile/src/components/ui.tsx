import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  type ScrollViewProps,
  type TextProps,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/theme/theme-context";

function useNavigateTo(href?: string, beforeNavigate?: () => void) {
  const router = useRouter();
  return React.useCallback(() => {
    beforeNavigate?.();
    if (!href) return;
    if (/^https?:\/\//.test(href)) {
      Linking.openURL(href).catch(() => {});
      return;
    }
    router.push(href as never);
  }, [beforeNavigate, href, router]);
}

export function Screen({
  children,
  refreshing,
  onRefresh,
  contentContainerStyle,
  ...props
}: ScrollViewProps & { refreshing?: boolean; onRefresh?: () => void }) {
  const { colors } = useAppTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor="#E10600" />
        ) : undefined
      }
      contentContainerStyle={[
        { paddingBottom: 40 },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export function AppText({
  variant = "body",
  muted,
  style,
  ...props
}: TextProps & {
  variant?: "hero" | "display" | "title" | "subtitle" | "body" | "caption" | "mono" | "eyebrow";
  muted?: boolean;
}) {
  const { colors, brand } = useAppTheme();
  const variants = {
    hero: { fontSize: 42, lineHeight: 44, fontWeight: "900" as const, letterSpacing: 0 },
    display: { fontSize: 32, lineHeight: 36, fontWeight: "900" as const, letterSpacing: 0 },
    title: { fontSize: 24, lineHeight: 29, fontWeight: "900" as const, letterSpacing: 0 },
    subtitle: { fontSize: 17, lineHeight: 23, fontWeight: "700" as const },
    body: { fontSize: 16, lineHeight: 25, fontWeight: "400" as const },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: "500" as const },
    mono: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "700" as const,
      fontVariant: ["tabular-nums"] as TextProps["style"] extends infer _ ? string[] : never,
    },
    eyebrow: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: "800" as const,
      textTransform: "uppercase" as const,
      letterSpacing: 0,
      color: brand.f1Red,
    },
  };

  return (
    <Text
      selectable
      {...props}
      style={[{ color: muted ? colors.secondaryText : colors.text }, variants[variant], style]}
    />
  );
}

export function Card({
  children,
  style,
  accentColor,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  accentColor?: string;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
          borderCurve: "continuous",
          padding: 16,
          gap: 12,
          overflow: "hidden",
          boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
        },
        accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Section({
  children,
  warm,
  style,
}: {
  children: React.ReactNode;
  warm?: boolean;
  style?: ViewStyle;
}) {
  const { colors, brand, mode } = useAppTheme();
  const gradientColors = warm
    ? (mode === "dark"
        ? ["rgba(225,6,0,0.12)", colors.background, "rgba(245,158,11,0.05)"]
        : ["rgba(225,6,0,0.08)", colors.background, "rgba(245,158,11,0.08)"])
    : ([colors.background, colors.background, colors.background] as string[]);
  return (
    <LinearGradient
      colors={gradientColors as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          borderTopWidth: warm ? 1 : 0,
          borderBottomWidth: warm ? 1 : 0,
          borderColor: colors.border,
          paddingHorizontal: 18,
          paddingVertical: 26,
          gap: 18,
        },
        style,
      ]}
    >
      {warm ? <View style={{ height: 2, width: 52, backgroundColor: brand.f1Red }} /> : null}
      {children}
    </LinearGradient>
  );
}

export function HeroPanel({
  eyebrow,
  title,
  subtitle,
  imageUri,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  imageUri?: string;
  children?: React.ReactNode;
}) {
  const { colors, brand, mode } = useAppTheme();
  return (
    <View
      style={{
        minHeight: 470,
        paddingHorizontal: 22,
        paddingTop: 48,
        paddingBottom: 28,
        justifyContent: "flex-end",
        overflow: "hidden",
        backgroundColor: colors.background,
      }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          contentFit="contain"
          style={{
            position: "absolute",
            top: 92,
            left: -95,
            right: -95,
            height: 255,
            opacity: mode === "dark" ? 0.7 : 0.45,
          }}
        />
      ) : null}
      <LinearGradient
        colors={[
          "rgba(225,6,0,0.2)",
          mode === "dark" ? "rgba(11,10,9,0.2)" : "rgba(250,249,247,0.36)",
          colors.background,
        ]}
        locations={[0, 0.48, 1]}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <View style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, justifyContent: "space-around" }}>
        {[0, 1, 2, 3].map((line) => (
          <View
            key={line}
            style={{
              height: 2,
              width: 180 + line * 32,
              marginLeft: -40 + line * 20,
              opacity: 0.12,
              backgroundColor: brand.f1Red,
              transform: [{ rotate: "-8deg" }],
            }}
          />
        ))}
      </View>
      <View style={{ gap: 20 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[0, 1, 2, 3, 4].map((light) => (
            <View
              key={light}
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                backgroundColor: brand.f1Red,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.12)",
                shadowColor: brand.f1Red,
                shadowOpacity: 0.45,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 0 },
              }}
            />
          ))}
        </View>
        <View style={{ gap: 12 }}>
          {eyebrow ? <Pill tone="red">{eyebrow}</Pill> : null}
          <AppText variant="hero">{title}</AppText>
          {subtitle ? <AppText muted style={{ fontSize: 17, lineHeight: 27 }}>{subtitle}</AppText> : null}
        </View>
        {children ? <View style={{ gap: 12 }}>{children}</View> : null}
      </View>
    </View>
  );
}

export function FlagPanel({
  children,
  accentColor,
  style,
  muted,
}: {
  children: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
  muted?: boolean;
}) {
  const { colors, brand } = useAppTheme();
  const flagColor = accentColor ?? brand.f1Red;
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
          borderCurve: "continuous",
          padding: 18,
          gap: 12,
          overflow: "hidden",
          opacity: muted ? 0.82 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 46,
          height: 46,
          backgroundColor: flagColor,
          transform: [{ rotate: "45deg" }, { translateX: 24 }, { translateY: -24 }],
        }}
      />
      {children}
    </View>
  );
}

export function ListGroup({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 16,
          borderCurve: "continuous",
          overflow: "hidden",
          shadowColor: "#000000",
          shadowOpacity: 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function ListRow({
  children,
  href,
  onPress,
  accentColor,
  compact,
}: {
  children: React.ReactNode;
  href?: string;
  onPress?: () => void;
  accentColor?: string;
  compact?: boolean;
}) {
  const { colors } = useAppTheme();
  const handlePress = useNavigateTo(href, onPress);
  const row = (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        minHeight: compact ? 52 : 64,
        paddingHorizontal: 16,
        paddingVertical: compact ? 10 : 13,
        gap: 6,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: pressed ? colors.cardHover : colors.card,
        borderLeftWidth: accentColor ? 3 : 0,
        borderLeftColor: accentColor,
      })}
    >
      {children}
    </Pressable>
  );
  return row;
}

export function ArticleBody({ paragraphs }: { paragraphs: string[] }) {
  const { colors, brand } = useAppTheme();
  if (!paragraphs.length) return null;
  const [lead, ...rest] = paragraphs;
  return (
    <View style={{ gap: 22 }}>
      <FlagPanel>
        <AppText style={{ fontSize: 18, lineHeight: 30, color: colors.text, fontWeight: "600" }}>
          {lead}
        </AppText>
      </FlagPanel>
      <View style={{ gap: 18 }}>
        {rest.map((paragraph, index) => (
          <View
            key={`${paragraph.slice(0, 28)}-${index}`}
            style={{
              paddingLeft: index % 4 === 0 ? 14 : 0,
              borderLeftWidth: index % 4 === 0 ? 2 : 0,
              borderLeftColor: index % 4 === 0 ? brand.f1Red : "transparent",
            }}
          >
            <AppText muted style={{ fontSize: 17, lineHeight: 30 }}>
              {paragraph}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

export function RaceImage({ uri, height = 180, alt }: { uri?: string; height?: number; alt?: string }) {
  const { colors } = useAppTheme();
  if (!uri) return null;
  return (
    <Image
      source={{ uri }}
      contentFit="cover"
      transition={180}
      accessibilityLabel={alt}
      style={{ height, backgroundColor: colors.secondaryBackground, borderRadius: 14 }}
    />
  );
}

export function DriverTile({
  imageUri,
  name,
  meta,
  number,
  tag,
  accentColor,
  href,
  trailing,
}: {
  imageUri?: string;
  name: string;
  meta: string;
  number?: string;
  tag?: string;
  accentColor?: string;
  href?: string;
  trailing?: React.ReactNode;
}) {
  const { colors, brand } = useAppTheme();
  const { width } = useWindowDimensions();
  const compact = width < 900;
  const handlePress = useNavigateTo(href);
  const body = (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        width: compact ? "100%" : "48%",
        flexBasis: compact ? "100%" : "46%",
        minWidth: compact ? "100%" : 280,
        maxWidth: compact ? "100%" : 360,
        flexGrow: compact ? 0 : 1,
        flexShrink: 1,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        borderCurve: "continuous",
        overflow: "hidden",
        opacity: pressed ? 0.76 : 1,
      })}
    >
      <View style={{ minHeight: compact ? 132 : 260, flexDirection: compact ? "row" : "column" }}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            contentFit="cover"
            transition={180}
            style={{
              width: compact ? 122 : "100%",
              height: compact ? "100%" : 180,
              backgroundColor: colors.secondaryBackground,
            }}
          />
        ) : null}
        <View style={{ flex: 1, padding: 14, gap: 5, justifyContent: "flex-end" }}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              backgroundColor: accentColor ?? brand.f1Red,
            }}
          />
          {number ? (
            <AppText
              variant="mono"
              style={{
                color: colors.tertiaryText,
                fontSize: 30,
                lineHeight: 32,
                position: "absolute",
                right: 12,
                top: 12,
                opacity: 0.5,
              }}
            >
              {number}
            </AppText>
          ) : null}
          <AppText variant="subtitle">{name}</AppText>
          <AppText variant="mono" style={{ color: accentColor ?? colors.secondaryText }}>
            {meta}
          </AppText>
          {tag ? <Pill tone="red">{tag}</Pill> : null}
          {trailing ? <View style={{ marginTop: 6 }}>{trailing}</View> : null}
        </View>
      </View>
    </Pressable>
  );
  return body;
}

export function GlassSurface({
  children,
  style,
  interactive,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  interactive?: boolean;
}) {
  const { colors, mode } = useAppTheme();
  const baseStyle: ViewStyle = {
    borderRadius: 20,
    borderCurve: "continuous",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.strongBorder,
  };

  if (isLiquidGlassAvailable()) {
    return (
      <GlassView isInteractive={interactive} style={[baseStyle, style]}>
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView
      tint={mode === "dark" ? "systemMaterialDark" : "systemMaterialLight"}
      intensity={85}
      style={[baseStyle, { backgroundColor: colors.glass }, style]}
    >
      {children}
    </BlurView>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "red" | "amber" | "green";
}) {
  const { colors, brand } = useAppTheme();
  const background =
    tone === "red"
      ? "rgba(225,6,0,0.14)"
      : tone === "amber"
        ? "rgba(245,158,11,0.16)"
        : tone === "green"
          ? "rgba(67,176,42,0.16)"
          : colors.secondaryBackground;
  const color = tone === "red" ? brand.f1Red : tone === "amber" ? brand.amber : tone === "green" ? colors.success : colors.secondaryText;
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: background,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <AppText variant="caption" style={{ color, fontWeight: "800" }}>
        {children}
      </AppText>
    </View>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ gap: 5 }}>
      {eyebrow ? <AppText variant="eyebrow">{eyebrow}</AppText> : null}
      <AppText variant="title">{title}</AppText>
      {subtitle ? <AppText muted>{subtitle}</AppText> : null}
    </View>
  );
}

export function LoadingState({ label = "Loading F1 data..." }: { label?: string }) {
  const { colors, brand } = useAppTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", gap: 12 }}>
      <ActivityIndicator color={brand.f1Red} />
      <AppText muted>{label}</AppText>
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={{ padding: 18, gap: 14 }}>
      <Card>
        <Pill tone="red">Data unavailable</Pill>
        <AppText variant="subtitle">{message}</AppText>
        {onRetry ? <ActionButton label="Try again" onPress={onRetry} /> : null}
      </Card>
    </View>
  );
}

export function ActionButton({
  label,
  onPress,
  href,
  selected,
}: {
  label: string;
  onPress?: () => void;
  href?: string;
  selected?: boolean;
}) {
  const { colors, brand } = useAppTheme();
  const handlePress = useNavigateTo(href, onPress);
  const content = (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        alignSelf: "flex-start",
        minHeight: 42,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 9,
        backgroundColor: selected ? brand.f1Red : colors.secondaryBackground,
        opacity: pressed ? 0.72 : 1,
        borderWidth: 1,
        borderColor: selected ? brand.f1Red : colors.border,
      })}
    >
      <AppText
        variant="caption"
        style={{
          color: selected ? "#FFFFFF" : colors.text,
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
  return content;
}

export function FavoriteButton({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  return <ActionButton label={active ? "Saved" : "Save"} selected={active} onPress={onPress} />;
}

export function RemoteImage({ uri, height = 220 }: { uri?: string; height?: number }) {
  const { colors } = useAppTheme();
  if (!uri) return null;
  return (
    <Image
      source={{ uri }}
      contentFit="cover"
      transition={160}
      style={{
        height,
        borderRadius: 16,
        backgroundColor: colors.secondaryBackground,
      }}
    />
  );
}

export function KeyValueRow({ label, value }: { label: string; value: React.ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 10,
      }}
    >
      <AppText muted>{label}</AppText>
      {typeof value === "string" || typeof value === "number" ? (
        <AppText variant="mono">{value}</AppText>
      ) : (
        value
      )}
    </View>
  );
}

export function InlineList({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>;
}
