
export enum GenerationState {
  Idle,
  Loading,
  Finished,
  Error,
}

export interface UploadedFiles {
  requirements: File | null;
  sequenceDiagram: File | null;
  configImage: File | null;
}
