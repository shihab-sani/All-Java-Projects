package patient.management.GRPC;

import billing.BillResponse;
import billing.BillingServiceGrpc.BillingServiceImplBase;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.grpc.server.service.GrpcService;

@Slf4j
@GrpcService
public class BillingGrpcService extends BillingServiceImplBase {

    @Override
    public void CreateBillingAccount(billing.BillRequest request,
                                     StreamObserver<BillResponse> responseObserver) {

        log.info("Received billing request for patient ID: {}", request.toString());

        BillResponse response = BillResponse.newBuilder()
                .setBillingAccountId("2345").setStatus("SUCCESS")
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
