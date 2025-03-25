import { Image } from "@prisma/client";
import React, { useState } from "react";
import { env } from "~/env";
import ImagePostModal from "./ImagePostModal";

type Props = {
  postId: string;
  images: Image[];
};

const PostImageContainer = ({ postId, images }: Props) => {
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  if (!images[0]) return undefined;
  if (images.length == 1) {
    return (
      <div className="mt-3 overflow-hidden rounded-2xl border border-gray-300">
        <ImagePostModal
          postId={postId}
          isOpen={imageModalIsOpen}
          setIsOpen={setImageModalIsOpen}
          index={imageIndex}
          setIndex={setImageIndex}
          imageCount={images.length}
        />
        {images.map((image) => (
          <img
            onClick={(e) => {
              setImageModalIsOpen(true);
              e.preventDefault();
            }}
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
        <ImagePostModal
          postId={postId}
          isOpen={imageModalIsOpen}
          setIsOpen={setImageModalIsOpen}
          index={imageIndex}
          setIndex={setImageIndex}
          imageCount={images.length}
        />
        {images.map((image) => (
          <img
            onClick={(e) => {
              setImageModalIsOpen(true);
              setImageIndex(0);
              e.preventDefault();
            }}
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
        <ImagePostModal
          postId={postId}
          isOpen={imageModalIsOpen}
          setIsOpen={setImageModalIsOpen}
          index={imageIndex}
          setIndex={setImageIndex}
          imageCount={images.length}
        />
        <div className="w-1/2">
          <img
            onClick={(e) => {
              setImageModalIsOpen(true);
              e.preventDefault();
              setImageIndex(0);
            }}
            className="= h-full max-h-[516px] max-w-[257px] object-cover "
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[0].id}`}
            key={images[0].id}
          />
        </div>
        <div className="flex w-1/2 flex-col gap-px">
          <img
            onClick={(e) => {
              setImageModalIsOpen(true);
              e.preventDefault();
              setImageIndex(1);
            }}
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[1]!.id}`}
            key={images[1]!.id}
          />
          <img
            onClick={(e) => {
              setImageModalIsOpen(true);
              e.preventDefault();
              setImageIndex(2);
            }}
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
        <ImagePostModal
          postId={postId}
          isOpen={imageModalIsOpen}
          setIsOpen={setImageModalIsOpen}
          index={imageIndex}
          setIndex={setImageIndex}
          imageCount={images.length}
        />
        <div className="flex w-1/2 flex-col gap-px">
          <img
            onClick={(e) => {
              setImageModalIsOpen(true);
              e.preventDefault();
              setImageIndex(0);
            }}
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[0].id}`}
            key={images[0].id}
          />
          <img
            onClick={(e) => {
              setImageModalIsOpen(true);
              e.preventDefault();
              setImageIndex(1);
            }}
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[1]!.id}`}
            key={images[1]!.id}
          />
        </div>
        <div className="flex w-1/2 flex-col gap-px">
          <img
            onClick={(e) => {
              setImageModalIsOpen(true);
              e.preventDefault();
              setImageIndex(2);
            }}
            className="max-h-[257px] w-full max-w-[257px] object-cover"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${images[2]!.id}`}
            key={images[2]!.id}
          />
          <img
            onClick={(e) => {
              setImageModalIsOpen(true);
              e.preventDefault();
              setImageIndex(3);
            }}
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
