import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import './global.css';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { OutputFormat } from '@/src/main/preload';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cross1Icon } from '@radix-ui/react-icons';

function Footer() {
  return (
    <>
      <a
        className={
          'absolute left-2 bottom-2 text-xs text-muted-foreground underline'
        }
        href={'https://dupanovic.com'}
      >
        dupanovic
      </a>
      <p className={'absolute right-2 bottom-2 text-xs text-muted-foreground'}>
        v.1.0.0
      </p>
    </>
  );
}

function App() {
  const [selectedFilePath, setSelectedFilePath] = useState<string>();
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [outputQuality, setOutputQuality] = useState<number>(100);
  const outputPath = useMemo(
    () =>
      selectedFilePath &&
      `${selectedFilePath.substring(
        0,
        selectedFilePath.lastIndexOf('.'),
      )}.${outputFormat}`,
    [selectedFilePath, outputFormat],
  );
  const outputFormats = [
    'jpg',
    'jpeg',
    'png',
    'avif',
    'webp',
    'gif',
    'tiff',
    'raw',
  ];

  // Show editing screen after a file has been selected
  if (selectedFilePath) {
    return (
      <div className={'relative flex flex-col px-16 pt-8'}>
        <div className={'absolute top-4 right-4'}>
          <Cross1Icon onClick={() => setSelectedFilePath(undefined)} />
        </div>
        <div className={'flex flex-col items-center space-y-4'}>
          <div className={'flex flex-col self-start'}>
            <p className={'text'}>Selected file:</p>
            <p className={'text-sm text-zinc-400'}>{selectedFilePath}</p>
          </div>
          <Separator />
          <div className={'flex flex-row justify-between w-full items-center'}>
            <p>{`Format: ${outputFormat}`}</p>
            <Select
              value={outputFormat}
              onValueChange={(value: OutputFormat) => setOutputFormat(value)}
            >
              <SelectTrigger className={'w-[300px]'}>
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent className="overflow-y-auto max-h-[160px]">
                {outputFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className={'flex flex-row justify-between w-full items-center'}>
            <p>{`Quality: ${outputQuality}%`}</p>
            <Slider
              className={'w-[300px]'}
              value={[outputQuality]}
              min={1}
              onValueChange={(value) => setOutputQuality(value[0])}
            />
          </div>
          <Separator />
          <div className={'pt-6 flex flex-row space-x-2'}>
            <Button
              className={'w-[150px]'}
              onClick={async () => {
                const filePath = await window.electronAPI.openFile();
                setSelectedFilePath(filePath);
              }}
            >
              Select new file
            </Button>
            <Button
              className={'w-[150px]'}
              onClick={async () => {
                if (!selectedFilePath) return;
                window.electronAPI.editFile({
                  filePath: selectedFilePath,
                  fileFormat: outputFormat,
                  quality: outputQuality,
                });
                toast(`Created new file at: ${outputPath}!`);
              }}
            >
              {`Convert to ${outputFormat}`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show welcome screen when there is no file selected
  return (
    <div
      id={'landing'}
      className={
        'relative h-screen flex flex-col items-center space-y-8 pt-20 px-4'
      }
    >
      <h1
        className={
          'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'
        }
      >
        Welcome to Aenigma
      </h1>
      <div className={'flex flex-col space-y-2 items-center'}>
        <p className={'leading-7 [&:not(:first-child)]:mt-6'}>
          Select an image to get started!
        </p>
        <div className={'flex flex-row space-x-2'}>
          <Button
            className={'w-[120px]'}
            onClick={async () => {
              const filePath = await window.electronAPI.openFile();
              setSelectedFilePath(filePath);
            }}
          >
            Select file
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Root() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <App />
              <Toaster />
            </>
          }
        />
      </Routes>
    </Router>
  );
}
