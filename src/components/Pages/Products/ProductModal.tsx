"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FNGetAllProducts } from "@/fetchers/types";

type Props = {
  product?: FNGetAllProducts[number];
  onClose: () => void;
  onSuccess?: (product: FNGetAllProducts[number]) => void;
};

const ProductModal = (props: Props) => {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <Button>Hiiiiii</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
