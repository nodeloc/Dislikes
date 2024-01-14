import PaginatedListState, { PaginatedListParams } from 'flarum/common/states/PaginatedListState';
import User from 'flarum/common/models/User';

export interface PostDislikesModalListParams extends PaginatedListParams {
  filter: {
    disliked: string;
  };
  page?: {
    offset?: number;
    limit: number;
  };
}

export default class PostDislikesModalState<P extends PostDislikesModalListParams = PostDislikesModalListParams> extends PaginatedListState<User, P> {
  constructor(params: P, page: number = 1) {
    const limit = 10;

    params.page = { ...(params.page || {}), limit };

    super(params, page, limit);
  }

  get type(): string {
    return 'users';
  }
}
