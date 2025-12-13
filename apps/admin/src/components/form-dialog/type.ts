export interface FormDialogProps<Type, Schema> {
  isEdit?: boolean;
  initialValue?: Type;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submit: (data: Schema) => Promise<void>;
}
3;
