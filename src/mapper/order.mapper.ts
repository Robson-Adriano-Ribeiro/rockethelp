import { OrderFirestoreDTO } from "../DTOs/OrderDTO";
import { OrderDetails } from "../screens/Details";
import dateFormat from '../utils/firestoreDataFormat';

export function convertOrderFirestoreDTOToOrderDetails(docId: string, orderFirestoreDTO: OrderFirestoreDTO): OrderDetails {
    return {
        id: docId,
        patrimony: orderFirestoreDTO.patrimony,
        description: orderFirestoreDTO.description,
        status: orderFirestoreDTO.status,
        solution: orderFirestoreDTO.solution,
        when: dateFormat(orderFirestoreDTO.created_at),
        closed: orderFirestoreDTO.closed_at ? dateFormat(orderFirestoreDTO.closed_at) : null
    }
}