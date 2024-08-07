import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  IconBrandYoutube,
  IconBrandYoutubeFilled,
  IconBrandTwitter,
  IconBrandInstagram,
  IconMap,
  IconCode,
} from '@tabler/icons-react';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  LexicalEditor,
} from 'lexical';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { INSERT_EMBED_COMMAND } from '../../utils/exportedCommands';
import EmbedButton from '../../../../components/EmbedButton/EmbedButton';

import { Button, Textarea } from '@mantine/core';
import { DialogButtonsGrid, DialogFooter } from '../../ui/Dialog';
import { TextInput } from '@mantine/core';
import {
  $createEmbedNode,
  EmbedNode,
  EmbedPayload,
} from '../../nodes/EmbedNode';
import { $createEmbedBlockNode } from '../../nodes/EmbedBlockNode';

export type InsertEmbedPayload = Readonly<EmbedPayload>;

const urlSchema = z.string().url();

function getVideoIdFromUrl(url: string, embedType: string) {
  switch (embedType) {
    case 'youtube': {
      const regex = /\/embed\/(.*?)\?si=/;
      const result = url.match(regex);
      if (result && result[1]) {
        return result[1];
      }
      break;
    }
    case 'youtube-shorts': {
      const regex = /\/shorts\/(.*?)\?si=/;
      const result = url.match(regex);
      if (result && result[1]) {
        return result[1];
      }
      break;
    }
  }
  return '';
}

function getTweetIdFromInput(input: string) {
  const regex = /\/status\/(.*?)$/;
  const result = input.match(regex);
  if (result && result[1]) {
    return result[1];
  }
  return '';
}

function getEmbeddedScript(input: string): string {
  const result = input.match(/<script.*?<\/script>$/);
  return result ? result[0] : '';
}

// Remove the script tag from embed code, as it will be added programmatically
function stripScriptFromEmbedCode(input: string): string {
  return input.replace(/<script.*?<\/script>$/, '');
}

export function InsertYoutubeDialog({
  onClick,
  embedType,
}: {
  onClick: (payload: InsertEmbedPayload) => void;
  embedType: string;
}) {
  const [input, setInput] = useState('');
  const [source, setSource] = useState('');
  const [maxWidth, setMaxWidth] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string | null>(null);

  const isDisabled = source === '';

  const transformYoutube = (value: string) => {
    const div = document.createElement('div');
    div.innerHTML = value;
    const iframe = div.firstChild;
    if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
      setInput(value);
      return;
    }
    const width = iframe.width;
    const height = iframe.height;
    const src = iframe.src;
    const title = iframe.title;
    setMaxWidth(width);
    setAspectRatio(`${Number(width) / Number(height)} / 1`);
    const videoID = getVideoIdFromUrl(src, embedType);
    if (!videoID) {
      setInput(value);
      return;
    }
    const newIframe = `<iframe width='100%' height='100%' credentialless src='https://www.youtube-nocookie.com/embed/${videoID}' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen title=${title} referrerpolicy='strict-origin-when-cross-origin'></iframe>`;

    setInput(value);
    setSource(newIframe);
  };

  const handleSubmit = (): void => {
    const payload = {
      embedType: embedType,
      source: source,
      width: '100%',
      maxWidth: `${maxWidth}px`,
      aspectRatio: aspectRatio,
    };
    onClick(payload);
  };

  return (
    <>
      <Textarea
        label='YouTube Video Embed Code'
        autosize
        minRows={6}
        maxRows={12}
        placeholder='e.g. <iframe width="560" height="315" ...'
        description='The raw embed code copied from YouTube'
        onChange={(e) => transformYoutube(e.currentTarget.value)}
        value={input}
        data-test-id='embed-modal-html-input'
        required
      />
      <DialogFooter>
        <Button
          data-test-id='embed-modal-confirm-btn'
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}

export function InsertYoutubeShortDialog({
  onClick,
  embedType,
}: {
  onClick: (payload: InsertEmbedPayload) => void;
  embedType: string;
}) {
  const [input, setInput] = useState('');
  const [source, setSource] = useState('');

  const isDisabled = source === '';

  const transformYoutubeShort = (value: string) => {
    const parseResult = urlSchema.safeParse(value);
    if (!parseResult || parseResult.success !== true) {
      setInput(value);
      return;
    }
    const videoID = getVideoIdFromUrl(value, embedType);
    if (!videoID) {
      setInput(value);
      return;
    }
    const newIframe = `<iframe width='100%' height='100%' credentialless src='https://www.youtube-nocookie.com/embed/${videoID}' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen title='YouTube Short Video' referrerpolicy='strict-origin-when-cross-origin'></iframe>`;

    setInput(value);
    setSource(newIframe);
  };

  const handleSubmit = (): void => {
    const payload = {
      embedType: embedType,
      source: source,
      width: '100%',
      maxWidth: `315px`,
      aspectRatio: `${315 / 560} / 1`,
    };
    onClick(payload);
  };

  return (
    <>
      <TextInput
        label='YouTube Short Link'
        placeholder='e.g. https://youtube.com/shorts/....'
        description='Paste the link to a YouTube short'
        onChange={(e) => transformYoutubeShort(e.currentTarget.value)}
        value={input}
        required
        data-test-id='embed-modal-html-input'
      />
      <DialogFooter>
        <Button
          data-test-id='embed-modal-confirm-btn'
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}

export function InsertTwitterDialog({
  onClick,
  embedType,
}: {
  onClick: (payload: InsertEmbedPayload) => void;
  embedType: string;
}) {
  const [input, setInput] = useState('');
  const [source, setSource] = useState('');

  const isDisabled = source === '';

  const transformTwitter = (value: string) => {
    const parseResult = urlSchema.safeParse(value);
    if (!parseResult || parseResult.success !== true) {
      setInput(value);
      return;
    }
    const tweetID = getTweetIdFromInput(value);
    if (!tweetID) {
      setInput(value);
      return;
    }
    setInput(value);
    setSource(tweetID);
  };

  const handleSubmit = (): void => {
    const payload = {
      embedType: embedType,
      source: source,
    };
    onClick(payload);
  };

  return (
    <>
      <TextInput
        label='Link to Tweet'
        placeholder='e.g. https://twitter.com/user/status/1234567890'
        description='Paste the link to a Tweet'
        onChange={(e) => transformTwitter(e.currentTarget.value)}
        value={input}
        required
        data-test-id='embed-modal-html-input'
      />
      <DialogFooter>
        <Button
          data-test-id='embed-modal-confirm-btn'
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}

export function InsertInstagramDialog({
  onClick,
  embedType,
}: {
  onClick: (payload: InsertEmbedPayload) => void;
  embedType: string;
}) {
  const [input, setInput] = useState('');
  const [source, setSource] = useState('');
  const [maxWidth, setMaxWidth] = useState<string | null>(null);

  const isDisabled = source === '';

  const transformInstagram = (value: string) => {
    const div = document.createElement('div');
    div.innerHTML = value;
    const blockquote = div.firstChild;
    if (!blockquote || !(blockquote instanceof HTMLQuoteElement)) {
      setInput(value);
      return;
    }
    const maxWidth = blockquote.style.maxWidth;
    if (maxWidth) {
      setMaxWidth(maxWidth);
      blockquote.style.removeProperty('max-width');
    }
    blockquote.style.removeProperty('min-width');
    const embedString = stripScriptFromEmbedCode(div.innerHTML);
    if (!embedString) {
      setInput(value);
      return;
    }
    setInput(embedString);
    setSource(embedString);
  };

  const handleSubmit = (): void => {
    const payload = {
      embedType: embedType,
      source: source,
      maxWidth: maxWidth,
      width: '100%',
    };
    onClick(payload);
  };

  return (
    <>
      <Textarea
        label='Instagram Embed Code'
        autosize
        minRows={6}
        maxRows={12}
        placeholder='e.g. <blockquote class="instagram-media" data-instgrm ...'
        description='The raw embed code copied from Instagram'
        onChange={(e) => transformInstagram(e.currentTarget.value)}
        value={input}
        data-test-id='embed-modal-html-input'
        required
      />
      <DialogFooter>
        <Button
          data-test-id='embed-modal-confirm-btn'
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}

export function InsertGoogleMapsDialog({
  onClick,
  embedType,
}: {
  onClick: (payload: InsertEmbedPayload) => void;
  embedType: string;
}) {
  const [input, setInput] = useState('');
  const [source, setSource] = useState('');
  const [maxWidth, setMaxWidth] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string | null>(null);

  const isDisabled = source === '';

  const transformGoogleMaps = (value: string) => {
    const div = document.createElement('div');
    div.innerHTML = value;
    const iframe = div.firstChild;
    if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
      setInput(value);
      return;
    }
    const width = iframe.width;
    const height = iframe.height;
    const src = iframe.src;
    const parseResult = urlSchema.safeParse(src);
    if (!parseResult || parseResult.success !== true) {
      setInput(value);
      return;
    }
    setMaxWidth(width);
    setAspectRatio(`${Number(width) / Number(height)} / 1`);
    const newIframe = `<iframe width='100%' height='100%' frameborder='0' style='border: 0' src='${src}' credentialless allowFullScreen title='Google Maps' referrerpolicy='strict-origin-when-cross-origin'></iframe>`;

    setInput(value);
    setSource(newIframe);
  };

  const handleSubmit = (): void => {
    const payload = {
      embedType: embedType,
      source: source,
      width: '100%',
      maxWidth: `${maxWidth}px`,
      aspectRatio: aspectRatio,
    };
    onClick(payload);
  };

  return (
    <>
      <Textarea
        label='Google Maps Embed Code'
        autosize
        minRows={6}
        maxRows={12}
        placeholder='e.g. <iframe src="https://www.google.com/maps...'
        description='The raw embed code copied from Google Maps'
        onChange={(e) => transformGoogleMaps(e.currentTarget.value)}
        value={input}
        data-test-id='embed-modal-html-input'
        required
      />

      <DialogFooter>
        <Button
          data-test-id='embed-modal-confirm-btn'
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}

export function InsertGeneralDialog({
  onClick,
  embedType,
}: {
  onClick: (payload: InsertEmbedPayload) => void;
  embedType: string;
}) {
  const [input, setInput] = useState('');
  const [source, setSource] = useState('');

  const isDisabled = source === '';

  const attemptToLoadScript = (script: string) => {
    const div = document.createElement('div');
    div.innerHTML = script;
    const inputScript = div.firstChild;
    if (inputScript && inputScript instanceof HTMLScriptElement) {
      const newScript = document.createElement('script');
      newScript.onload = () => console.log('loaded');
      newScript.src = inputScript.src;
      newScript.async = true;
      newScript.dataset.type = inputScript.src;
      // If script alreay exists, don't create another one
      const existingScript = document.querySelectorAll(
        `[data-type="${newScript.src}"]`
      );
      if (!existingScript.length) {
        document.body?.appendChild(newScript);
      }
    }
  };

  const transformGeneralEmbed = (value: string) => {
    const div = document.createElement('div');
    div.innerHTML = value;
    const embedElement = div.firstChild;
    if (!embedElement || !(embedElement instanceof HTMLElement)) {
      setInput(value);
      return;
    }
    const embeddedScript = getEmbeddedScript(div.innerHTML);
    // CASE EMBED CODE HAS SCRIPT TAG, MEANING TRY TO LOAD IT
    if (embeddedScript) {
      attemptToLoadScript(embeddedScript);
      const embedString = stripScriptFromEmbedCode(div.innerHTML);
      if (!embedString) {
        setInput(value);
        return;
      }
      setInput(embedString);
      setSource(embedString);
      // CASE EMBED IS AN IFRAME WITHOUT SCRIPT TAG
    } else {
      const div = document.createElement('div');
      div.innerHTML = value;
      const iframe = div.firstChild;
      if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
        setInput(value);
        return;
      }
      setInput(div.innerHTML);
      setSource(div.innerHTML);
    }
  };

  const handleSubmit = (): void => {
    const payload = {
      embedType: embedType,
      source: source,
    };
    onClick(payload);
  };

  return (
    <>
      <Textarea
        label='Embed Code'
        autosize
        minRows={6}
        maxRows={12}
        placeholder='e.g. <iframe src="...'
        description='The raw embed code you wish to insert'
        onChange={(e) => transformGeneralEmbed(e.currentTarget.value)}
        value={input}
        data-test-id='embed-modal-html-input'
        required
      />
      <DialogFooter>
        <Button
          data-test-id='embed-modal-confirm-btn'
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}

export function InsertEmbedDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [embedType, setMode] = useState<
    | null
    | 'youtube'
    | 'youtube-shorts'
    | 'twitter'
    | 'instagram'
    | 'google-maps'
    | 'general'
  >(null);

  // Data for Embed Type Buttons
  const embedTypeButtonItems = [
    {
      text: 'YouTube',
      onClick: () => setMode('youtube'),
      icon: IconBrandYoutube,
    },
    {
      text: 'YouTube Short',
      onClick: () => setMode('youtube-shorts'),
      icon: IconBrandYoutubeFilled,
    },
    {
      text: 'Twitter',
      onClick: () => setMode('twitter'),
      icon: IconBrandTwitter,
    },
    {
      text: 'Instagram',
      onClick: () => setMode('instagram'),
      icon: IconBrandInstagram,
    },
    {
      text: 'Google Maps',
      onClick: () => setMode('google-maps'),
      icon: IconMap,
    },
    {
      text: 'Other (experimental)',
      onClick: () => setMode('general'),
      icon: IconCode,
    },
  ];

  const onClick = (payload: InsertEmbedPayload): void => {
    activeEditor.dispatchCommand(INSERT_EMBED_COMMAND, payload);
    onClose();
  };

  return (
    <>
      {!embedType && (
        <DialogButtonsGrid>
          {embedTypeButtonItems.map((item, index) => {
            return <EmbedButton key={index} item={item} />;
          })}
        </DialogButtonsGrid>
      )}

      {embedType === 'youtube' && (
        <InsertYoutubeDialog onClick={onClick} embedType={embedType} />
      )}
      {embedType === 'youtube-shorts' && (
        <InsertYoutubeShortDialog onClick={onClick} embedType={embedType} />
      )}
      {embedType === 'twitter' && (
        <InsertTwitterDialog onClick={onClick} embedType={embedType} />
      )}
      {embedType === 'instagram' && (
        <InsertInstagramDialog onClick={onClick} embedType={embedType} />
      )}
      {embedType === 'google-maps' && (
        <InsertGoogleMapsDialog onClick={onClick} embedType={embedType} />
      )}
      {embedType === 'general' && (
        <InsertGeneralDialog onClick={onClick} embedType={embedType} />
      )}
    </>
  );
}

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;

export default function EmbedPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EmbedNode])) {
      throw new Error('EmbedPlugin: EmbedNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertEmbedPayload>(
        INSERT_EMBED_COMMAND,
        (payload) => {
          const newEmbedBlock = $createEmbedBlockNode();
          $insertNodes([newEmbedBlock]);

          const embedNode = $createEmbedNode(payload);
          $insertNodes([embedNode]);

          // Add new paragraph node below created image
          const newParagraphNode = $createParagraphNode();
          $insertNodes([newParagraphNode]);

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
