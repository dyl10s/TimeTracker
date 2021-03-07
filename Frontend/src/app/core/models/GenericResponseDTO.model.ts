export interface GenericResponseDTO<T = any> {
    data: T;
    message: string;
    success: boolean;
}