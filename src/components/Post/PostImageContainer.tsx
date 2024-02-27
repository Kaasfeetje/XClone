import { Image } from "@prisma/client";
import React from "react";
import { env } from "~/env";

type Props = {
  images: Image[];
};

const PostImageContainer = ({ images }: Props) => {
  if (!images[0]) return undefined;
  if (images.length == 1) {
    return (
      <div className="mt-3 overflow-hidden rounded-2xl border border-gray-300">
        {images.map((image) => (
          <img
            className="max-h-[516px] w-full max-w-[516px] object-contain"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${image.id}`}
            key={image.id}
          />
        ))}
      </div>
    );
  }
  if (images.length == 2) {
    return (
      <div className="mt-3 flex gap-px overflow-hidden rounded-2xl border border-gray-300">
        {images.map((image) => (
          <img
            className="max-h-[516px] w-full max-w-[257px] object-contain"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${image.id}`}
            key={image.id}
          />
        ))}
      </div>
    );
  }

  if (images.length == 3) {
    return (
      <div className="mt-3 flex gap-px overflow-hidden rounded-2xl border border-gray-300">
        <div className="w-1/2">
          <img
            className="= h-full max-h-[516px] max-w-[257px] object-cover "
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[0].id}`}
            key={images[0].id}
          />
        </div>
        <div className="flex w-1/2 flex-col gap-px">
          <img
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[1]!.id}`}
            key={images[1]!.id}
          />
          <img
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[2]!.id}`}
            key={images[2]!.id}
          />
        </div>
      </div>
    );
  }

  if (images.length == 4) {
    return (
      <div className="mt-3 flex gap-px overflow-hidden rounded-2xl border border-gray-300">
        <div className="flex w-1/2 flex-col gap-px">
          <img
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[0]!.id}`}
            key={images[0]!.id}
          />
          <img
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[1]!.id}`}
            key={images[1]!.id}
          />
        </div>
        <div className="flex w-1/2 flex-col gap-px">
          <img
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[2]!.id}`}
            key={images[2]!.id}
          />
          <img
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[3]!.id}`}
            key={images[3]!.id}
          />
        </div>
      </div>
    );
  }

  return undefined;
};

export default PostImageContainer;
