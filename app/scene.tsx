"use client";

import { useState } from "react";
import { type Scene as SceneData, scenePlace } from "./catalog";
import type { Locale } from "./i18n";

/**
 * مشهدٌ من بلد الفرع خلف المحتوى.
 *
 * الصورة زخرفةٌ للقارئ الآلي (alt فارغ): ما تحملُه من معنًى مكتوبٌ في
 * توقيع الموضع تحتها، فلا يُقال الشيءُ مرّتين. ولا تُعرَض إن لم تُحمَّل —
 * قسمٌ بلا مشهدٍ أهونُ من إطارٍ مكسورٍ خلف العطور.
 */
export function Scene({
  scene,
  locale,
  className = "",
}: {
  scene: SceneData;
  locale: Locale;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;

  return (
    <div className={["scene", className].filter(Boolean).join(" ")}>
      <img
        className="scene-photo"
        src={scene.image}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setOk(false)}
      />
      <span className="scene-place">{scenePlace(scene, locale)}</span>
    </div>
  );
}
