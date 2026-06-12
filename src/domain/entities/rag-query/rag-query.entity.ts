import { Department } from "@domain/entities/document/document.value-objects";
import { InvalidRagQueryTransitionException } from "./rag-query.exceptions";
import {
  QueryText,
  RagQueryId,
  RagQueryStatus,
} from "./rag-query.value-objects";

interface RagQueryProps {
  id: RagQueryId;
  queryText: QueryText;
  answer: string | null;
  askedBy: string;
  department: Department;
  status: RagQueryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class RagQuery {
  private readonly props: RagQueryProps;

  private constructor(props: RagQueryProps) {
    this.props = props;
  }

  static create(
    queryText: QueryText,
    askedBy: string,
    department: Department,
  ): RagQuery {
    return new RagQuery({
      id: RagQueryId.generate(),
      queryText,
      answer: null,
      askedBy,
      department,
      status: RagQueryStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: RagQueryProps): RagQuery {
    return new RagQuery(props);
  }

  get id(): RagQueryId {
    return this.props.id;
  }

  get queryText(): QueryText {
    return this.props.queryText;
  }

  get answer(): string | null {
    return this.props.answer;
  }

  get askedBy(): string {
    return this.props.askedBy;
  }

  get department(): Department {
    return this.props.department;
  }

  get status(): RagQueryStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  markAnswered(answer: string): void {
    if (this.props.status !== RagQueryStatus.PENDING) {
      throw new InvalidRagQueryTransitionException(
        this.props.status,
        RagQueryStatus.ANSWERED,
      );
    }
    this.props.answer = answer;
    this.props.status = RagQueryStatus.ANSWERED;
    this.props.updatedAt = new Date();
  }

  markFailed(): void {
    if (this.props.status !== RagQueryStatus.PENDING) {
      throw new InvalidRagQueryTransitionException(
        this.props.status,
        RagQueryStatus.FAILED,
      );
    }
    this.props.status = RagQueryStatus.FAILED;
    this.props.updatedAt = new Date();
  }
}
