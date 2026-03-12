import { useQRCode } from 'next-qrcode';

interface QrCodeProps {
  data: string;
  width?: number;
}

export const QrCode = ({ data, width = 200 }: QrCodeProps) => {
  const { Image } = useQRCode();

  if (!data) return <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-500 text-sm">Loading QR...</div>;

  return (
    <div className="bg-white p-2 rounded-lg inline-block">
      <Image
        text={data}
        options={{
          type: 'image/jpeg',
          quality: 1,
          errorCorrectionLevel: 'M',
          margin: 3,
          scale: 4,
          width: width,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        }}
      />
    </div>
  );
};