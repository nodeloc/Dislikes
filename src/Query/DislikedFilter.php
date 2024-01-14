<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Dislikes\Query;

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;

class DislikedFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'disliked';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $dislikedId = trim($filterValue, '"');

        $filterState
            ->getQuery()
            ->whereIn('id', function ($query) use ($dislikedId) {
                $query->select('user_id')
                    ->from('post_dislikes')
                    ->where('post_id', $dislikedId);
            }, 'and', $negate);
    }
}
