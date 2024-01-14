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
use Flarum\Filter\ValidateFilterTrait;

class DislikedByFilter implements FilterInterface
{
    use ValidateFilterTrait;

    public function getFilterKey(): string
    {
        return 'dislikedBy';
    }

    public function filter(FilterState $filterState, $filterValue, bool $negate)
    {
        $dislikedId = $this->asInt($filterValue);

        $filterState
            ->getQuery()
            ->whereIn('id', function ($query) use ($dislikedId, $negate) {
                $query->select('post_id')
                    ->from('post_dislikes')
                    ->where('user_id', $negate ? '!=' : '=', $dislikedId);
            });
    }
}
