/**
 * Apple Shortcuts Plist (.shortcut) & iOS WebClip Profile Generator
 * Produces valid XML property lists with WFWorkflowActions conforming to Apple iOS Shortcuts schema,
 * and Apple .mobileconfig WebClip profiles for 1-click home screen installation.
 */

export interface PlistAction {
  WFWorkflowActionIdentifier: string;
  WFWorkflowActionParameters: Record<string, any>;
}

export interface ShortcutMetadata {
  name: string;
  glyphNumber?: number;
  colorNumber?: number; // e.g., 4282601983 for blue
  actions: PlistAction[];
}

function escapeXml(unsafe: string): string {
  if (typeof unsafe !== 'string') return String(unsafe);
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function valueToPlistXml(val: any, indent: string = '        '): string {
  if (val === null || val === undefined) {
    return `${indent}<string></string>\n`;
  }
  if (typeof val === 'boolean') {
    return `${indent}<${val ? 'true' : 'false'}/>\n`;
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return `${indent}<integer>${val}</integer>\n`;
    }
    return `${indent}<real>${val}</real>\n`;
  }
  if (typeof val === 'string') {
    return `${indent}<string>${escapeXml(val)}</string>\n`;
  }
  if (Array.isArray(val)) {
    let res = `${indent}<array>\n`;
    for (const item of val) {
      res += valueToPlistXml(item, indent + '  ');
    }
    res += `${indent}</array>\n`;
    return res;
  }
  if (typeof val === 'object') {
    let res = `${indent}<dict>\n`;
    for (const [k, v] of Object.entries(val)) {
      res += `${indent}  <key>${escapeXml(k)}</key>\n`;
      res += valueToPlistXml(v, indent + '  ');
    }
    res += `${indent}</dict>\n`;
    return res;
  }
  return `${indent}<string>${escapeXml(String(val))}</string>\n`;
}

export function generateShortcutXmlPlist(metadata: ShortcutMetadata): string {
  const glyph = metadata.glyphNumber || 59445; // Default lightning / spark glyph
  const color = metadata.colorNumber || 4282601983; // Blue accent

  let actionsXml = '';
  for (const action of metadata.actions) {
    actionsXml += '    <dict>\n';
    actionsXml += `      <key>WFWorkflowActionIdentifier</key>\n`;
    actionsXml += `      <string>${escapeXml(action.WFWorkflowActionIdentifier)}</string>\n`;
    actionsXml += `      <key>WFWorkflowActionParameters</key>\n`;
    actionsXml += valueToPlistXml(action.WFWorkflowActionParameters, '      ');
    actionsXml += '    </dict>\n';
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>WFWorkflowActions</key>
  <array>
${actionsXml}  </array>
  <key>WFWorkflowClientRelease</key>
  <string>3.0</string>
  <key>WFWorkflowClientVersion</key>
  <string>2600.0.1</string>
  <key>WFWorkflowIcon</key>
  <dict>
    <key>WFWorkflowIconGlyphNumber</key>
    <integer>${glyph}</integer>
    <key>WFWorkflowIconStartColor</key>
    <integer>${color}</integer>
  </dict>
  <key>WFWorkflowImportQuestions</key>
  <array/>
  <key>WFWorkflowInputContentItemClasses</key>
  <array>
    <string>WFStringContentItem</string>
    <string>WFURLContentItem</string>
  </array>
  <key>WFWorkflowMinimumClientVersion</key>
  <integer>900</integer>
  <key>WFWorkflowMinimumClientVersionString</key>
  <string>900</string>
  <key>WFWorkflowTypes</key>
  <array>
    <string>NCWidget</string>
    <string>WatchKit</string>
    <string>ActionExtension</string>
  </array>
</dict>
</plist>`;
}

/**
 * Helper to download generated plist as a .shortcut file
 */
export function downloadShortcutFile(filename: string, xmlContent: string): void {
  const blob = new Blob([xmlContent], { type: 'application/x-apple-aspen-shortcut;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanName = filename.endsWith('.shortcut') ? filename : `${filename}.shortcut`;
  a.download = cleanName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * iOS WebClip Profile (.mobileconfig) Generator
 * Allows direct, 1-click home screen installation on iOS without signing restrictions.
 */
export function generateWebClipMobileConfig(title: string, targetUrl: string): string {
  let url = targetUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  const cleanTitle = escapeXml(title || 'Web App');
  const uuid1 = '3D5C' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-4E8B';
  const uuid2 = '9F1A' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-8C2D';

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key>
      <true/>
      <key>IsRemovable</key>
      <true/>
      <key>Label</key>
      <string>${cleanTitle}</string>
      <key>PayloadDescription</key>
      <string>WebClip Profile for ${cleanTitle}</string>
      <key>PayloadDisplayName</key>
      <string>${cleanTitle}</string>
      <key>PayloadIdentifier</key>
      <string>com.shortcutshub.webclip.${uuid1}</string>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key>
      <string>${uuid1}</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>Precomposed</key>
      <true/>
      <key>URL</key>
      <string>${escapeXml(url)}</string>
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>${cleanTitle}</string>
  <key>PayloadIdentifier</key>
  <string>com.shortcutshub.profile.${uuid2}</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${uuid2}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;
}

export function downloadMobileConfigFile(filename: string, title: string, url: string): void {
  const xml = generateWebClipMobileConfig(title, url);
  const blob = new Blob([xml], { type: 'application/x-apple-aspen-config;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  const cleanName = filename.endsWith('.mobileconfig') ? filename : `${filename}.mobileconfig`;
  a.download = cleanName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

/**
 * Built-in generators for Quick Tools
 */

export function buildWhatsAppDirectShortcut(phone: string, templateMessage?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = templateMessage ? encodeURIComponent(templateMessage) : '';
  const waUrl = `https://wa.me/${cleanPhone}${encodedText ? `?text=${encodedText}` : ''}`;

  return generateShortcutXmlPlist({
    name: `WhatsApp Direct ${cleanPhone ? `(${cleanPhone})` : ''}`,
    glyphNumber: 59477, // Chat bubble glyph
    colorNumber: 4282601983,
    actions: [
      {
        WFWorkflowActionIdentifier: 'is.workflow.actions.url',
        WFWorkflowActionParameters: {
          WFURLActionURL: waUrl
        }
      },
      {
        WFWorkflowActionIdentifier: 'is.workflow.actions.openurl',
        WFWorkflowActionParameters: {
          Show_WFInput: true
        }
      }
    ]
  });
}

export function buildTelegramDirectShortcut(usernameOrPhone: string, templateMessage?: string): string {
  const clean = usernameOrPhone.trim().replace(/^@/, '');
  const encodedText = templateMessage ? encodeURIComponent(templateMessage) : '';
  const tgUrl = `https://t.me/${clean}${encodedText ? `?text=${encodedText}` : ''}`;

  return generateShortcutXmlPlist({
    name: `Telegram Direct (${clean})`,
    glyphNumber: 59477,
    colorNumber: 4282601983,
    actions: [
      {
        WFWorkflowActionIdentifier: 'is.workflow.actions.url',
        WFWorkflowActionParameters: {
          WFURLActionURL: tgUrl
        }
      },
      {
        WFWorkflowActionIdentifier: 'is.workflow.actions.openurl',
        WFWorkflowActionParameters: {
          Show_WFInput: true
        }
      }
    ]
  });
}

export function buildWebAppLauncherShortcut(title: string, targetUrl: string): string {
  let url = targetUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  return generateShortcutXmlPlist({
    name: title || 'Web App Launcher',
    glyphNumber: 59445,
    colorNumber: 4282601983,
    actions: [
      {
        WFWorkflowActionIdentifier: 'is.workflow.actions.url',
        WFWorkflowActionParameters: {
          WFURLActionURL: url
        }
      },
      {
        WFWorkflowActionIdentifier: 'is.workflow.actions.openurl',
        WFWorkflowActionParameters: {
          Show_WFInput: true
        }
      }
    ]
  });
}
