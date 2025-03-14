import { LoaderCircle } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderCircle className="size-10 animate-spin" />
    </div>
  );
};

export default Loading;
